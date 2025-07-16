import {Review, ReviewId} from '@domain/review/review';
import {PlacementId} from "@domain/placement/placement";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {GetReviewListParams} from "@domain/review/repositories/params/get-list.params";

export interface IReviewRepository {
  getById(id: ReviewId): Promise<Review | null>
  getByTwogisExternalId(externalId: string): Promise<Review | null>;
  getByTwogisExternalIds(externalIds: string[]): Promise<Review[]>;
  getReviewsByOrganizationPlacementId(placementId: PlacementId): Promise<Review[]>;
  saveAll(reviews: Review[]): Promise<void>;
  getTwogisReviewForReply(placementId: PlacementId): Promise<Review | null>
  delete(id: ReviewId): Promise<void>
  save(review: Review): Promise<void>
  getReviewList(params: GetReviewListParams): Promise<PaginatedResult<Review>>
}
