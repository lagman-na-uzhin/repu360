import {ITwogisRepository} from "@application/integrations/twogis/repository/twogis-repository.interface";
import {Review} from "@domain/review/review";
import {UniqueEntityID} from "@domain/common/unique-id";
import {
  IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import { IReviewRepository } from '@domain/review/repositories/review-repository.interface';
import { IProfileRepository } from '@domain/review/repositories/profile-repository.interface';
import { Profile } from '@domain/review/profile';
import {
  SyncReviewsPcInput
} from "@application/use-cases/background/review/twogis/sync-reviews/sync-reviews-pc.input";
import {Placement} from "@domain/placement/placement";

export class SyncTwogisReviewsProcessUseCase {
  constructor(
      private readonly organizationRepo: IOrganizationRepository,
      private readonly twogisRepo: ITwogisRepository,
      private readonly reviewRepo: IReviewRepository,
      private readonly profileRepo: IProfileRepository,
  ) {}

  async execute(command: SyncReviewsPcInput) {
    const platform = await this.getPlatformOrFail(command.organizationPlacement);
    const unSyncedObj = await this.getUnSyncedReviewObj(platform);

    if (!unSyncedObj) return;

    const { reviewsToSave, profilesToSave } = await this.processUnSyncedReviews(unSyncedObj)

    await this.saveEntities(reviewsToSave, profilesToSave);
  }

  private async getPlatformOrFail(placementId: UniqueEntityID): Promise<Placement> {
    const platform = await this.organizationRepo.getPlacementById(placementId.toString());
    if (!platform) throw new Error(EXCEPTION.ORGANIZATION.PLATFORM_NOT_FOUND);
    return platform;
  }

  private async getUnSyncedReviewObj(placement: Placement): Promise<{ profile: Profile, review: Review }[] | null> {
    const twogisDetails = placement.getTwogisPlacementDetail();
    return this.twogisRepo.getOrganizationReviews(placement.id, twogisDetails.externalId, {type: twogisDetails.type})
  }

  private async processUnSyncedReviews(unSyncedObj: { profile: Profile; review: Review }[]) {
    const reviewsToSave: Review[] = [];
    const profilesToSave: Profile[] = [];

    for (const { review: unSyncReview, profile: unSyncProfile } of unSyncedObj) {
      const existingReview = await this.reviewRepo.getByExternalId(unSyncReview.getTwogisReviewPlacementDetail().externalId);
      const existingProfile = await this.profileRepo.getByExternalId(unSyncProfile.getTwogisProfilePlacementDetail().externalId);

      reviewsToSave.push(this.getUpdatedOrNewReview(existingReview, unSyncReview));
      profilesToSave.push(this.getUpdatedOrNewProfile(existingProfile, unSyncProfile));
    }

    return { reviewsToSave, profilesToSave };
  }

  private getUpdatedOrNewReview(existingReview: Review | null, newReview: Review): Review {
    if (existingReview) {
      existingReview.update(newReview.text, newReview.rating, newReview.media, newReview.getTwogisReviewPlacementDetail());
      return existingReview;
    }
    return newReview;
  }

  private getUpdatedOrNewProfile(existingProfile: Profile | null, newProfile: Profile): Profile {
    if (existingProfile) {
      existingProfile.update(newProfile.firstname, newProfile.surname, newProfile.avatar);
      return existingProfile;
    }
    return newProfile;
  }

  private async saveEntities(reviewsToSave: Review[], profilesToSave: Profile[]) {
    if (reviewsToSave.length) await this.reviewRepo.saveAll(reviewsToSave);
    if (profilesToSave.length) await this.profileRepo.saveAll(profilesToSave);
  }
}
