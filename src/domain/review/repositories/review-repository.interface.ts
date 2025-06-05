import {Review, ReviewId} from '@domain/review/review';
import {PlacementId} from "@domain/placement/placement";
import {OrganizationId} from "@domain/organization/organization";

export interface IReviewRepository {
  getById(id: ReviewId): Promise<Review | null>
  getByTwogisExternalId(externalId: string): Promise<Review | null>;
  getByExternalIds(externalIds: string[]): Promise<Review[]>;
  getReviewsByOrganizationPlacementId(placementId: PlacementId): Promise<Review[]>;
  saveAll(reviews: Review[]): Promise<void>;
  getTwogisReviewForReply(placementId: PlacementId): Promise<Review | null>
  delete(id: ReviewId): Promise<void>
}
