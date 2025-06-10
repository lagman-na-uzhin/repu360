import { ICacheRepository } from "@application/interfaces/repositories/cache/cache-repository.interface";
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
import {IFirstAnswer} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";


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
        const { reviewId, placementId, companyId } = this.initializeCommandObjects(command);

        await this.twogisSession.init(companyId);

        const review = await this.retrieveReviewAndPreCheck(reviewId);

        const placement = await this.retrievePlacement(placementId);
        const accessToken = await this.getTwogisCabinetAccessToken(placement);

        if (!accessToken) return;

        try {
            const eligibility = await this.evaluateReviewEligibilityAndSync(review, accessToken);

            if (eligibility.hasExistingOfficialReply) {
                return;
            }

            if (!eligibility.canBeReplied) {
                await this.cacheRepo.setTwogisReplyCooldown(placement.id);
                return;
            }

            await this.composeAndSubmitReply(review, accessToken, placement);

            await this.reviewRepo.save(review);

        } catch (error) {
            if (error instanceof Error && error.message === ERR_REQUEST.INVALID_GRANT) {
                await this.cacheRepo.deleteTwogisCabinetAuth(placementId);
            }
            throw error;
        }
    }

    private initializeCommandObjects(command: TwogisSendReplyCommand) {
        return {
            reviewId: new ReviewId(command.reviewId),
            placementId: new PlacementId(command.placementId),
            companyId: new CompanyId(command.companyId)
        };
    }

    private async retrieveReviewAndPreCheck(reviewId: ReviewId): Promise<Review> {
        const review = await this.reviewRepo.getById(reviewId);
        if (!review) {
            throw new Error(EXCEPTION.REVIEW.NOT_FOUND);
        }
        if (review.hasOfficialReply()) {
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

    private async getTwogisCabinetAccessToken(placement: Placement): Promise<string | null> {
        const credentials = placement.getTwogisPlacementDetail().cabinetCredentials;
        if (!credentials) {
            throw new Error(EXCEPTION.PLACEMENT.TWOGIS_INVALID_CABINET_CREDENTIALS);
        }

        const accessTokenResponse = await this.twogisSession.getCabinetAccessToken(credentials);
        if (!accessTokenResponse || !accessTokenResponse.result || !accessTokenResponse.result.access_token) {
            throw new Error("2GIS access token not found or invalid response structure.");
        }
        return accessTokenResponse.result.access_token;
    }

    private async evaluateReviewEligibilityAndSync(
        review: Review,
        accessToken: string,
    ): Promise<ReviewEligibility> {
        const twogisReviewExternalId = review.getTwogisReviewPlacementDetail().externalId;
        const twogisReviewData = await this.twogisSession.getReviewFromCabinet(
            twogisReviewExternalId,
            accessToken,
        );

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

        if (currentRating !== review.rating) {
            review.rating = currentRating;
        }

        if (hasCompanyCommentInTwogis) {
            review.setOfficialReply(result.firstAnswer.id, result.firstAnswer.text, ReplyType.EXTERNAL);
        }

        const canBeReplied = currentRating >= 4 && !hasCompanyCommentInTwogis;

        return {
            canBeReplied: canBeReplied,
            hasExistingOfficialReply: hasCompanyCommentInTwogis,
        };
    }

    private async composeAndSubmitReply(
        review: Review,
        accessToken: string,
        placement: Placement,
    ): Promise<void> {
        const reviewAuthorProfile = await this.profileRepo.getById(review.profileId) as Profile;
        const reviewLanguage = await this.languageDetectorService.detect(review.text!);

        const replyContent = await this.generateReplyContent(
            reviewAuthorProfile,
            reviewLanguage,
            accessToken,
            placement.id
        );

        if (!replyContent) {
            return;
        }

        const twogisReviewExternalId = review.getTwogisReviewPlacementDetail().externalId;
        const sendResult = await this.twogisSession.sendOfficialReply(
            accessToken,
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
        accessToken: string,
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
                    accessToken,
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
