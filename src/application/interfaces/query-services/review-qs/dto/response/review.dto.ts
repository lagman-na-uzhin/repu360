import {QSReviewProfileDto} from "@application/interfaces/query-services/review-qs/dto/response/review-profile.dto";
import {QSReviewMediaDto} from "@application/interfaces/query-services/review-qs/dto/response/review-media.dto";
import {QSReviewReplyDto} from "@application/interfaces/query-services/review-qs/dto/response/review-reply.dto";
import {PLATFORMS} from "@domain/common/platfoms.enum";

export interface QSReviewDto {
    id: string;
    text: string;
    rating: number;
    platform: PLATFORMS;
    placementId: string;
    createdAt: Date;
    profile?: QSReviewProfileDto;
    media: QSReviewMediaDto[];
    replies: QSReviewReplyDto[];

    detail?: {
        externalId: string;
    } | null;
}
