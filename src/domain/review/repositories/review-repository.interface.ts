import { Review } from '@domain/review/review';
import {PlacementId} from "@domain/placement/placement";


export interface IReviewRepository {
  getByExternalId(externalId: string): Promise<Review | null>
  getReviewsByOrganizationPlacementId(organizationPlacementId: PlacementId): Promise<Review[]>
  saveAll(reviews: Review[]): Promise<void>
}
