import { ReviewEntity } from 'src/infrastructure/entities/review/review.entity';
import {
    YandexReviewPlacementDetailEntity,
} from '@infrastructure/entities/review/placement-details/yandex-review.entity';
import {TwogisReviewPlacementDetailEntity} from "@infrastructure/entities/review/placement-details/twogis-review.entity";
import {ReviewReplyEntity} from "@infrastructure/entities/review/review-reply.entity";
import {ReviewMediaEntity} from "@infrastructure/entities/review/review-media.entity";


export const REVIEW_ENTITIES = [ReviewEntity, YandexReviewPlacementDetailEntity, TwogisReviewPlacementDetailEntity, ReviewReplyEntity, ReviewMediaEntity]
