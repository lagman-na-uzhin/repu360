import {ITwogisRepository} from "@application/interfaces/integrations/twogis/repository/twogis-repository.interface";
import {Review} from "@domain/review/review";
import {UniqueID} from "@domain/common/unique-id";
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
import {Placement, PlacementId} from "@domain/placement/placement";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";

export class SyncTwogisReviewsProcessUseCase {
  constructor(
      private readonly placementRepo: IPlacementRepository,
      private readonly twogisRepo: ITwogisRepository,
      private readonly reviewRepo: IReviewRepository,
      private readonly profileRepo: IProfileRepository,
  ) {}

  async execute(input: SyncReviewsPcInput) {
    const placement = await this.getPlacementOrFail(input.organizationPlacement);
    const unSyncedObj = await this.getUnSyncedReviewObj(placement);

    if (!unSyncedObj) return;

    const { reviewsToSave, profilesToSave } = await this.processUnSyncedReviews(unSyncedObj)

    await this.saveEntities(reviewsToSave, profilesToSave);
  }

  private async getPlacementOrFail(placementId: PlacementId): Promise<Placement> {
    const placement = await this.placementRepo.getById(placementId);
    if (!placement) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND);
    return placement;
  }

  private async getUnSyncedReviewObj(placement: Placement): Promise<{ profile: Profile, review: Review }[] | null> {
    const twogisDetail = placement.getTwogisPlacementDetail();
    return this.twogisRepo.getOrganizationReviews(placement.id, twogisDetail.externalId, {type: twogisDetail.type})
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
