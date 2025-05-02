import { Review } from '@domain/review/review';
import {PlacementId} from "@domain/placement/placement";


export interface IReviewRepository {
  getByTwogisExternalId(externalId: string): Promise<Review | null>;
  getByExternalIds(externalIds: string[]): Promise<Review[]>;
  getReviewsByOrganizationPlacementId(placementId: PlacementId): Promise<Review[]>;
  saveAll(reviews: Review[]): Promise<void>;
}
