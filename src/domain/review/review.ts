import { UniqueID } from '@domain/common/unique-id';
import { Platform } from "@domain/placement/types/platfoms.enum";
import { ReviewMedia } from '@domain/review/model/review/review-media';
import { PlacementId } from "@domain/placement/placement";
import { TwogisReviewPlacementDetail } from "@domain/review/model/review/twogis-review-placement-detail";
import { YandexReviewPlacementDetail } from "@domain/review/model/review/yandex-review-placement-detail";
import { ProfileId } from "@domain/review/profile";
import { Complaint } from "@domain/review/model/review/complaint";

export type ReviewPlacementDetail = TwogisReviewPlacementDetail | YandexReviewPlacementDetail;

export class ReviewId extends UniqueID {}

export class Review {
    private constructor(
      private readonly _id: ReviewId,
      private readonly _placementId: PlacementId,
      private readonly _profileId: ProfileId,
      private readonly _platform: Platform,
      private _text: string,
      private _rating: number,
      private _media: ReviewMedia[],
      private _placementDetail: ReviewPlacementDetail,
      // private _complaints: Complaint[]

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(
        placementId: PlacementId,
        profileId: ProfileId,
        platform: Platform,
        text: string,
        rating: number,
        media: ReviewMedia[],
        placementDetail: ReviewPlacementDetail,
      // complaints: Complaint[]
    ): Review {
        Review.validatePlacementDetail(platform, placementDetail);

        return new Review(new ReviewId(), placementId, profileId, platform, text, rating, media, placementDetail,);
    }

    static fromPersistence(
      reviewId: string,
      placementId: string,
      profileId: string,
      platform: Platform,
      text: string,
      rating: number,
      media: ReviewMedia[],
      placementDetail: ReviewPlacementDetail,
      // complaints: Complaint[]
    ): Review {
        return new Review(
          new ReviewId(reviewId),
          new PlacementId(placementId),
          new ProfileId(profileId),
          platform,
          text,
          rating,
          media,
          placementDetail,
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
        if (this._platform === Platform.TWOGIS && this._placementDetail instanceof TwogisReviewPlacementDetail) {
            return this._placementDetail;
        }
        throw new Error('Invalid detail access: Expected TWOGIS placement detail');
    }

    getYandexReviewPlacementDetail(): YandexReviewPlacementDetail {
        if (this._platform === Platform.YANDEX && this._placementDetail instanceof YandexReviewPlacementDetail) {
            return this._placementDetail;
        }
        throw new Error('Invalid detail access: Expected YANDEX placement detail');
    }

    private static validatePlacementDetail(platform: Platform, detail: ReviewPlacementDetail): void {
        if (platform === Platform.TWOGIS && !(detail instanceof TwogisReviewPlacementDetail)) {
            throw new Error('Invalid placement detail for TWOGIS placement-details');
        }
        if (platform === Platform.YANDEX && !(detail instanceof YandexReviewPlacementDetail)) {
            throw new Error('Invalid placement detail for YANDEX placement-details');
        }
    }

    get id(): ReviewId {
        return this._id;
    }

    get placementId(): PlacementId {
        return this._placementId;
    }

    get profileId(): ProfileId {
        return this._profileId;
    }

    get platform(): Platform {
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

}

