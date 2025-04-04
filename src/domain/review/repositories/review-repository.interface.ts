import { Review } from '@domain/review/review';


export interface IReviewRepository {
  getByExternalId(externalId: string): Promise<Review | null>
  getReviewsByOrganizationPlacementId(organizationPlacementId: string): Promise<Review[]>
  saveAll(reviews: Review[]): Promise<void>
}
