import { Expose, plainToInstance } from 'class-transformer';
import {Review} from "@domain/review/review";
import {PLATFORMS} from "@domain/placement/platfoms.enum";
import {ReplyType} from "@domain/review/value-object/reply/reply-type.vo";

export class ReviewResponseDto {
    @Expose()
    id: string;

    @Expose()
    placementId: string

    @Expose()
    profile: {
        id: string,
        platform: PLATFORMS,
        firstName: string,
        lastName: string,
        avatar: string | null,
        detail: any //TODO

        createdAt: Date,
        updatedAt: Date | null;
        deletedAt: Date | null
    };

    @Expose()
    platform: string;

    @Expose()
    text: string;

    @Expose()
    rating: string;

    @Expose()
    media: {url: string, createdAt: Date}[];

    @Expose()
    placementDetail: string;

    @Expose()
    replies: {
        id: string,
        externalId: string,
        text: string,
        isOfficial: boolean,
        profileId: string | null,
        type: ReplyType
    };

    @Expose()
    detail: any; //TODO

    public static fromDomain(review: Review): ReviewResponseDto {
        const plainObject = review.toPlainObject();
        return plainToInstance(ReviewResponseDto, plainObject, {
            excludeExtraneousValues: true,
        });
    }
}
