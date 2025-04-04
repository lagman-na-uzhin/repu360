import { ITwogisRepository } from '@application/integrations/twogis/repository/twogis-repository.interface';
import { GetOrganizationReviewsInDto } from '@application/integrations/twogis/client/dto/in/get-organization-reviews.in.dto';
import {
  IOrganizationReviewsOutDto,
  ITwogisPreviewUrls,
  ITwogisReview,
} from '@application/integrations/twogis/client/dto/out/organization-reviews.out.dto';
import { Review } from '@domain/review/review';
import { ITwogisClient } from 'src/application/integrations/twogis/client/twogis-client.interface';
import { Profile, ProfileId } from '@domain/review/profile';
import { UniqueEntityID } from '@domain/common/unique-id';
import { OrganizationPlacementId } from '@domain/placement/platform-placement';
import { Platform } from '@domain/common/enums/platfoms.enum';
import { TwogisReviewPlacementDetail } from '@domain/review/model/review/twogis-review-placement-detail';
import { TwogisProfilePlacementDetail } from '@domain/review/model/profile/twogis-profile-placement-detail';
import { ReviewMedia } from '@domain/review/model/review/review-media';

export class TwogisRepository implements ITwogisRepository {
  constructor(private readonly twogisClient: ITwogisClient) {}
  async getOrganizationReviews(
    organizationPlatformId: UniqueEntityID,
    twogisOrganizationExternalId: string,
    payload: GetOrganizationReviewsInDto,
  ): Promise<{ review: Review; profile: Profile }[] | null> {
    const list: IOrganizationReviewsOutDto | null =
      await this.twogisClient.getOrganizationReviews(
        twogisOrganizationExternalId,
        payload,
      );

    const result: { review: Review; profile: Profile }[] = [];
    if (!list) return null;
    else
      list.reviews.map((obj) => {
        const profile = this.createProfileModel(
          obj.user.id,
          obj.user.name,
          obj.user.photo_preview_urls,
        );
        const review = this.createReviewModel(
          obj,
          organizationPlatformId,
          profile.id,
        );
        return result.push({ review, profile });
      });

    return result;
  }

  private createReviewModel(
    contract: ITwogisReview,
    organizationPlacementId: OrganizationPlacementId,
    profileId: ProfileId,
  ): Review {
    return Review.create(
      organizationPlacementId,
      profileId,
      Platform.TWOGIS,
      contract.text,
      contract.rating,
      contract.photos.flatMap((i) =>
        i.preview_urls.map((photo) =>
          ReviewMedia.create(photo.url, new Date(i.date_created)),
        ),
      ),
      TwogisReviewPlacementDetail.create(contract.id),
    );
  }

  private createProfileModel(
    id: string,
    name: string,
    twogisPreviewUrls: ITwogisPreviewUrls,
  ): Profile {
    return Profile.create(Platform.TWOGIS, name, name, twogisPreviewUrls.url, TwogisProfilePlacementDetail.create(id))

  }
}
