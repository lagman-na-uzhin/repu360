import {
    GetOrganizationReviewsInDto,
} from "@application/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import { Profile } from '@domain/review/profile';
import { Review } from '@domain/review/review';
import {UniqueEntityID} from "@domain/common/unique-id";
import { PlacementId } from '@domain/placement/placement';

export interface ITwogisRepository {
    getOrganizationReviews(
        organizationPlcamentId: PlacementId,
        twogisOrganizationExternalId: string,
        payload: GetOrganizationReviewsInDto,
    ): Promise<{ review: Review; profile: Profile }[] | null>
}
