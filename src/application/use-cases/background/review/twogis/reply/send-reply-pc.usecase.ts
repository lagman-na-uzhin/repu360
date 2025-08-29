import { ICacheRepository } from "@application/interfaces/services/cache/cache-repository.interface";
import { IReviewRepository } from "@domain/review/repositories/review-repository.interface";
import { IPlacementRepository } from "@domain/placement/repositories/placement-repository.interface";
import { Placement, PlacementId } from "@domain/placement/placement";
import { Review, ReviewId } from "@domain/review/review";
import { ReplyType } from "@domain/review/value-object/reply/reply-type.vo";
import { IProfileRepository } from "@domain/review/repositories/profile-repository.interface";
import { LANGUAGE } from "@domain/common/language.enum";
import { IReplyTemplateRepository } from "@domain/review/repositories/reply-template-repository.interface";
import { ILanguageDetectorService } from "@application/interfaces/services/language-detector/language-detector-service.interface";
import { ITemplateService } from "@application/interfaces/services/template/template-service.interface";
import { ERR_REQUEST } from "@application/interfaces/services/request/request.enum";
import { TwogisSendReplyCommand } from "@application/use-cases/background/review/twogis/reply/send-reply.command";
import { ITwogisSession } from "@application/interfaces/integrations/twogis/twogis-session.interface";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";
import { Profile } from "@domain/review/profile";
import { CompanyId } from "@domain/company/company";
import { IFirstAnswer } from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";

interface ReviewEligibility {
    canBeReplied: boolean;
    hasExistingOfficialReply: IFirstAnswer | boolean;
}

export class TwogisSendReplyProcessUseCase {
    constructor(
        private readonly twogisSession: ITwogisSession,
        private readonly cacheRepo: ICacheRepository,
        private readonly reviewRepo: IReviewRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly profileRepo: IProfileRepository,
        private readonly replyTemplateRepo: IReplyTemplateRepository,
        private readonly languageDetectorService: ILanguageDetectorService,
        private readonly templateService: ITemplateService,
    ) {}

    async execute(command: TwogisSendReplyCommand): Promise<void> {
        try {
            const placement = await this.retrievePlacement(command.placementId);
            const cabinetCredentials = placement.getTwogisPlacementDetail().cabinetCredentials;
            if (!cabinetCredentials) {
                throw new Error(EXCEPTION.PLACEMENT.TWOGIS_INVALID_CABINET_CREDENTIALS);
            }

            await this.twogisSession.init(command.companyId, cabinetCredentials);
            const review = await this.getReviewAndPreCheck(command.reviewId);

            const twogisReviewExternalId = review.getTwogisReviewPlacementDetail().externalId;
            const twogisReviewData = await this.twogisSession.getReviewFromCabinet(twogisReviewExternalId);

            const { eligibility, officialReply } = await this.evaluateReviewEligibilityAndSync(review, twogisReviewData);

            if (officialReply) {
                review.setOfficialReply(officialReply.id, officialReply.text, ReplyType.EXTERNAL);
                await this.reviewRepo.save(review);
                return;
            }

            if (!eligibility.canBeReplied) {
                await this.cacheRepo.setTwogisReplyCooldown(placement.id);
                return;
            }

            await this.composeAndSubmitReply(review, placement);

            await this.reviewRepo.save(review);
        } catch (error) {
            if (error instanceof Error && error.message === ERR_REQUEST.INVALID_GRANT) {
                await this.cacheRepo.deleteTwogisCabinetAuth(command.placementId);
            }
            throw error;
        }
    }

    private async getReviewAndPreCheck(reviewId: ReviewId): Promise<Review> {
        const review = await this.reviewRepo.getById(reviewId);
        if (!review) {
            throw new Error(EXCEPTION.REVIEW.NOT_FOUND);
        }
        if (review.hasOfficialReply()) {
            // This case might be redundant now, but it's a good initial check.
            throw new Error(EXCEPTION.REVIEW.OFFICIAL_ANSWER_ALREADY_EXIST);
        }
        return review;
    }

    private async retrievePlacement(placementId: PlacementId): Promise<Placement> {
        const placement = await this.placementRepo.getById(placementId);
        if (!placement) {
            throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND);
        }
        return placement;
    }

    private async evaluateReviewEligibilityAndSync(
        review: Review,
        twogisReviewData: any, // Use a proper DTO type here if available
    ): Promise<{ eligibility: ReviewEligibility, officialReply?: IFirstAnswer }> {
        const responseCode = twogisReviewData?.meta?.code || twogisReviewData;

        if (responseCode === 404) {
            await this.reviewRepo.delete(review.id);
            throw new Error(`Review with ID ${review.id.toString()} not found in 2GIS; deleted from local system.`);
        }
        if (responseCode !== 200 || !twogisReviewData?.result) {
            throw new Error(`Failed to fetch review status from 2GIS for review ID ${review.id.toString()}. Code: ${responseCode}`);
        }

        const { result } = twogisReviewData;
        const currentRating = Number(result.rating);
        const hasCompanyCommentInTwogis = result.hasCompanyComment || result.firstAnswer;
        const firstAnswer = result.firstAnswer;

        if (currentRating !== review.rating) {
            review.rating = currentRating;
        }

        const canBeReplied = currentRating >= 4 && !hasCompanyCommentInTwogis;

        return {
            eligibility: {
                canBeReplied,
                hasExistingOfficialReply: hasCompanyCommentInTwogis,
            },
            officialReply: firstAnswer,
        };
    }

    private async composeAndSubmitReply(
        review: Review,
        placement: Placement,
    ): Promise<void> {
        const reviewAuthorProfile = await this.profileRepo.getById(review.profile.id) as Profile;
        const reviewLanguage = await this.languageDetectorService.detect(review.text!);

        const replyContent = await this.generateReplyContent(
            reviewAuthorProfile,
            reviewLanguage,
            placement.id
        );

        if (!replyContent) {
            return;
        }

        const twogisReviewExternalId = review.getTwogisReviewPlacementDetail().externalId;
        const sendResult = await this.twogisSession.sendOfficialReply(
            replyContent,
            twogisReviewExternalId
        );

        const responseCode = sendResult?.meta?.code || sendResult;

        if (responseCode === 200 && sendResult.result) {
            review.setOfficialReply(sendResult.result.id, sendResult.result.text, ReplyType.SENT);
        } else {
            throw new Error(`Failed to send official reply for review ID ${review.id.toString()}. Code: ${responseCode}.`);
        }
    }

    private async generateReplyContent(
        profile: Profile,
        language: LANGUAGE,
        placementId: PlacementId
    ): Promise<string | undefined> {
        let content: string | undefined;

        if (language === LANGUAGE.KZ || language === LANGUAGE.RU) {
            const customTemplate = await this.replyTemplateRepo.getCustomTemplate(placementId, language);
            if (customTemplate) {
                content = this.templateService.renderTemplate(customTemplate.text, {
                    name: profile?.firstname || '',
                });
            } else {
                const generatedReply = await this.twogisSession.generateReply(
                    profile?.firstname || '',
                );
                content = generatedReply?.result?.comment;
            }
        }

        if (content && content.indexOf('{') !== -1) {
            return undefined;
        }

        return content;
    }
}
