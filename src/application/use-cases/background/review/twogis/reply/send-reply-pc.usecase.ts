import {ITwogisClient} from "@application/interfaces/integrations/twogis/client/twogis-client.interface";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";
import {Review} from "@domain/review/review";
import {ReplyType} from "@domain/review/value-object/reply/reply-type.vo";
import {IProxyService} from "@application/interfaces/services/proxy/proxy-service.interface";
import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
import {LANGUAGE} from "@domain/common/language.enum";
import {IReplyTemplateRepository} from "@domain/review/repositories/reply-template-repository.interface";
import {ILanguageDetectorService} from "@application/interfaces/services/language-detector/language-detector-service.interface";
import {ITemplateService} from "@application/interfaces/services/template/template-service.interface";
import {ERR_REQUEST} from "@application/interfaces/services/request/request.enum";
import {TwogisSendReplyCommand} from "@application/use-cases/background/review/twogis/reply/send-reply.command";
import {ITwogisRepository} from "@application/interfaces/integrations/twogis/repository/twogis-repository.interface";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class TwogisSendReplyProcessUseCase {
    constructor(
        private readonly twogisSession: ITwogisSession,
        private readonly cacheRepo: ICacheRepository,
        private readonly reviewRepo: IReviewRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly proxyService: IProxyService,
        private readonly profileRepo: IProfileRepository,
        private readonly replyTemplateRepo: IReplyTemplateRepository,
        private readonly languageDetectorService: ILanguageDetectorService,
        private readonly templateService: ITemplateService,
    ) {}

    async execute(cmd: TwogisSendReplyCommand) {
        const {placementId, reviewId, companyId} = cmd;

        await this.twogisSession.init(companyId);

        const review = await this.reviewRepo.getById(reviewId);
        if (!review || !review.hasOfficialReply()) throw new Error(EXCEPTION.REVIEW.OFFICIAL_ANSWER_ALREADY_EXIST);

        const placement = await this.placementRepo.getById(placementId);
        if (!placement) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND);

        const accessToken = await this.getAccessToken(placement);
        if (!accessToken) return;

        try {
            const isAnswerable = await this.checkIfReviewAnswerable(
                review,
                accessToken,
            );

            if (!isAnswerable) {
                await this.cacheRepo.setTwogisReplyCooldown(placement.id);
            }

            await this.send(placement, review, accessToken);
        } catch (err) {
            if (err.message === ERR_REQUEST.INVALID_GRANT) {
                await this.cacheRepo.deleteTwogisCabinetAuth(placementId);
            }
            throw err;
        }
    }

    private async getAccessToken(placement: Placement): Promise<string | null> {
        const credentials = placement.getTwogisPlacementDetail().cabinetCredentials;
        if (!credentials) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_INVALID_CABINET_CREDENTIALS);

        const accessToken = await this.twogisSession.getCabinetAccessToken(credentials);
        if (!accessToken) throw new Error("Access token not found");

        return accessToken


    }

    private async checkIfReviewAnswerable(
        review: Review,
        accessToken: string,
    ): Promise<boolean> {
        const reviewRes = await this.twogisSession.getReviewFromCabinet(
            review.getTwogisReviewPlacementDetail().externalId,
            accessToken,
        );

        const responseCode = reviewRes?.meta?.code || reviewRes;

        if (responseCode === 200) {
            const { result } = reviewRes;

            const rating = Number(result.rating);
            const hasAnswer = result.hasCompanyComment || result.firstAnswer;
            const isAnswerable = rating >= 4 && !hasAnswer;

            if (rating != review.rating) {
                review.rating = rating;
            }

            if (hasAnswer) {
                review.setOfficialReply(result.firstAnswer.id, result.firstAnswer.text, ReplyType.EXTERNAL)
            }

            return isAnswerable;
        } else if (responseCode == 404) {
            await this.reviewRepo.delete(review.id);

            throw new Error(
                `Review not found id: ${review.id}`,
            );
        } else {
            console.log(`Can not get review answers`, {
                response: reviewRes,
            });

            throw new Error(
                `Some error happend while fetching review's answers, review id: ${review.id}`,
            );
        }
    }

    private async send(
        placement: Placement,
        review: Review,
        accessToken: string,
    ) {
        const answer = await this.generateAnswer(
            review,
            accessToken,
            placement,
        );

        if (!answer) {
            console.log(`Bad generated answer response`, review);
            return;
        }

        const sentReplyRes = await this.twogisSession.sendOfficialReply(
            accessToken,
            review.getTwogisReviewPlacementDetail().externalId,
            answer,
            proxy
        );

        const responseCode = sentReplyRes?.meta?.code || sentReplyRes;

        if (responseCode === 200) {
            const { result } = sentReplyRes;

            review.setOfficialReply(result.id, result.text, ReplyType.SENT);
        } else {
            console.log(`Can not sent answer to review`, {
                placementId: placement.id,
                response: sentReplyRes,
            });
        }
    }

    private async generateAnswer(
        review: Review,
        accessToken: string,
        placement: Placement,
        proxy: IProxy,
    ): Promise<string | undefined> {
        const profile = await this.profileRepo.getById(review.profileId);

        const reviewLanguage = await this.languageDetectorService.detect(
            review.text!,
        );

        let generatedAnswer: string | undefined;

        try {
            if (reviewLanguage === LANGUAGE.KZ || reviewLanguage === LANGUAGE.RU) {
                const customTemplate = await this.replyTemplateRepo.getCustomTemplate(placement.id, reviewLanguage)
                if (customTemplate) {
                    generatedAnswer = this.templateService.renderTemplate(customTemplate.text, {
                        name: profile?.firstname!,
                    });
                } else {
                    const generatedReply = await this.twogisSession.generateReply(
                        accessToken,
                        profile?.firstname!,
                        proxy,
                    );

                    generatedAnswer = generatedReply?.result?.comment;
                }
            }
        } catch (err) {
        } finally {
            if (generatedAnswer && generatedAnswer.indexOf('{') !== -1)
                generatedAnswer = undefined;
        }

        //
        // if (generatedAnswer && closingPhrase && closingPhrase[reviewLanguage]) {
        //     generatedAnswer += ` ${closingPhrase[reviewLanguage]}`;
        // }

        return generatedAnswer;
    }


    private getFirstName(fullName: string): string | undefined {
        if (!fullName || !fullName.length || typeof fullName != 'string') return;

        const splitted = fullName.split(' ');
        return splitted[0];
    }
}
