import { UniqueID } from '@domain/common/unique-id';
import { PLATFORMS } from "@domain/common/platfoms.enum";
import { ReviewMedia } from '@domain/review/model/review/review-media';
import { PlacementId } from "@domain/placement/placement";
import { TwogisReviewPlacementDetail } from "@domain/review/model/review/twogis-review-placement-detail";
import { YandexReviewPlacementDetail } from "@domain/review/model/review/yandex-review-placement-detail";
import {Profile, ProfileId} from "@domain/review/model/profile/profile";
import { Complaint } from "@domain/review/model/review/complaint/complaint";
import {Reply} from "@domain/review/model/review/reply/reply";
import {ReplyType} from "@domain/review/value-object/reply/reply-type.vo";

export type ReviewPlacementDetail = TwogisReviewPlacementDetail | YandexReviewPlacementDetail;

export class ReviewId extends UniqueID {}

export class Review {
    private constructor(
      private readonly _id: ReviewId,
      private readonly _placementId: PlacementId,
      private readonly _profile: Profile,
      private readonly _platform: PLATFORMS,
      private _text: string,
      private _rating: number,
      private _media: ReviewMedia[],
      private _placementDetail: ReviewPlacementDetail,
      private _replies: Reply[],
      // private _complaints: Complaint[]
    ) {}

    static create(
        placementId: PlacementId,
        profile: Profile,
        platform: PLATFORMS,
        text: string,
        rating: number,
        media: ReviewMedia[],
        placementDetail: ReviewPlacementDetail,
        replies: Reply[]
      // complaints: Complaint[]
    ): Review {
        Review.validatePlacementDetail(platform, placementDetail);

        return new Review(new ReviewId(), placementId, profile, platform, text, rating, media, placementDetail, replies);
    }

    static fromPersistence(
      reviewId: string,
      placementId: string,
      profile: Profile,
      platform: PLATFORMS,
      text: string,
      rating: number,
      media: ReviewMedia[],
      placementDetail: ReviewPlacementDetail,
      replies: Reply[]
      // complaints: Complaint[]
    ): Review {
        return new Review(
          new ReviewId(reviewId),
          new PlacementId(placementId),
          profile,
          platform,
          text,
          rating,
          media,
          placementDetail,
          replies
          // complaints
        );
    }

    update(text: string, rating: number, media: ReviewMedia[], placementDetail: ReviewPlacementDetail): void {
        Review.validatePlacementDetail(this._platform, placementDetail);

        this._text = text;
        this._rating = rating;
        this._media = media;
        this._placementDetail = placementDetail;
    }

    getTwogisReviewPlacementDetail(): TwogisReviewPlacementDetail {
        if (this._platform === PLATFORMS.TWOGIS && this._placementDetail instanceof TwogisReviewPlacementDetail) {
            return this._placementDetail;
        }
        throw new Error('Invalid detail access: Expected TWOGIS placement detail');
    }

    getYandexReviewPlacementDetail(): YandexReviewPlacementDetail {
        if (this._platform === PLATFORMS.YANDEX && this._placementDetail instanceof YandexReviewPlacementDetail) {
            return this._placementDetail;
        }
        throw new Error('Invalid detail access: Expected YANDEX placement detail');
    }

    hasOfficialReply() {
        return this._replies.find(reply => reply.isOfficial)
    }

    private static validatePlacementDetail(platform: PLATFORMS, detail: ReviewPlacementDetail): void {
        if (platform === PLATFORMS.TWOGIS && !(detail instanceof TwogisReviewPlacementDetail)) {
            throw new Error('Invalid placement detail for TWOGIS placement-details');
        }
        if (platform === PLATFORMS.YANDEX && !(detail instanceof YandexReviewPlacementDetail)) {
            throw new Error('Invalid placement detail for YANDEX placement-details');
        }
    }

    get id(): ReviewId {
        return this._id;
    }

    get placementId(): PlacementId {
        return this._placementId;
    }

    get profile(): Profile {
        return this._profile;
    }

    get platform(): PLATFORMS {
        return this._platform;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        if (!value.trim()) {
            throw new Error("Text cannot be empty");
        }
        this._text = value;
    }

    get rating(): number {
        return this._rating;
    }

    set rating(value: number) {
        if (value < 1 || value > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        this._rating = value;
    }

    get media(): ReviewMedia[] {
        return this._media;
    }

    set media(value: ReviewMedia[]) {
        this._media = value;
    }

    get placementDetail(): ReviewPlacementDetail {
        return this._placementDetail;
    }

    set placementDetail(value: ReviewPlacementDetail) {
        Review.validatePlacementDetail(this._platform, value);
        this._placementDetail = value;
    }

    setOfficialReply(replyExternalId: string, text: string, type: ReplyType) {
        this._replies.push(
            Reply.create(replyExternalId, text, type, true, null)
        )
    }


    toPlainObject() {
        return {
            id: this._id.toString(),
            placementId: this._placementId.toString(),
            profile: this._profile.toPlainObject(),
            platform: this._platform,
            text: this._text,
            rating: this._rating,
            media: this._media.map(m => m.toPlainObject()),
            placementDetail: this._placementDetail,
            replies: this._replies.map(r => r.toPlainObject()),
            detail: this.placementDetail

        }
    }
}

