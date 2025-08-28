import {Review} from "@domain/review/review";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import { IReviewRepository } from '@domain/review/repositories/review-repository.interface';
import { IProfileRepository } from '@domain/review/repositories/profile-repository.interface';
import { Profile } from '@domain/review/profile';
import {Placement, PlacementId} from "@domain/placement/placement";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";

export class SyncTwogisReviewsProcessUseCase {
  constructor(
      private readonly placementRepo: IPlacementRepository,
      private readonly twogisSession: ITwogisSession,
      private readonly reviewRepo: IReviewRepository,
      private readonly profileRepo: IProfileRepository,
      private readonly uow: IUnitOfWork,
  ) {}

  async execute(placementId: PlacementId) {
    console.log("PRoxeccer execute")
    await this.twogisSession.init()

    const placement = await this.getPlacementOrFail(placementId);
    console.log(placement, 'placement')
    const unSyncedReviews = await this.getUnSyncedReviewObj(placement);

    console.log(unSyncedReviews, "unSyncedReviews")
    if (!unSyncedReviews) {
      return;
    }
    const { reviewsToSave, profilesToSave } = await this.handleUnSyncedReviews(unSyncedReviews!);
    console.log(reviewsToSave, "reviewsToSave")

    await this.saveEntities(reviewsToSave, profilesToSave);
  }

  private async getPlacementOrFail(placementId: PlacementId): Promise<Placement> {
    const placement = await this.placementRepo.getById(placementId);
    if (!placement) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND);
    return placement;
  }

  private async getUnSyncedReviewObj(placement: Placement): Promise<Review[] | null> {
    const twogisDetail = placement.getTwogisPlacementDetail();
    return this.twogisSession.getOrganizationReviews(placement.id, placement.externalId, {type: 'branch'}) //TODO branch mock
  }

  private async handleUnSyncedReviews(unSyncedReviews: Review[]) {
    const reviewIds: string[]  = unSyncedReviews.map(x => x.getTwogisReviewPlacementDetail().externalId);
    const profileIds: string[] = unSyncedReviews.map(x => x.profile.getTwogisProfilePlacementDetail().externalId);

    const existingReviews  = await this.reviewRepo.getByTwogisExternalIds(reviewIds);
    const existingProfiles = await this.profileRepo.getByTwogisExternalIds(profileIds);

    const reviewMap: Map<string, Review>  = new Map(existingReviews.map(r  => [r.getTwogisReviewPlacementDetail().externalId, r]));
    const profileMap: Map<string, Profile> = new Map(existingProfiles.map(p => [p.getTwogisProfilePlacementDetail().externalId, p]));

    const reviewsToSave = unSyncedReviews.map((review) =>
            this.getUpdatedOrNewReview(reviewMap.get(review.getTwogisReviewPlacementDetail().externalId) || null,
            review
            )
    );
    const profilesToSave = unSyncedReviews.map((review) =>
            this.getUpdatedOrNewProfile(
                profileMap.get(review.profile.getTwogisProfilePlacementDetail().externalId) || null,
            review.profile
            )
    );

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
      existingProfile.update(newProfile.firstname, newProfile.lastName, newProfile.avatar);
      return existingProfile;
    }
    return newProfile;
  }

  private async saveEntities(reviewsToSave: Review[], profilesToSave: Profile[]) {
    console.log(" saveEntities method")
    await this.uow.run(async (ctx) => {
      if (profilesToSave.length) await ctx.profileRepo.saveAll(profilesToSave);
      if (reviewsToSave.length) await ctx.reviewRepo.saveAll(reviewsToSave);
    })
  }
}
