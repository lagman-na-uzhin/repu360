import {
    GetOrganizationReviewsInDto
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {
    IOrganizationReviewsOutDto
} from "@application/interfaces/integrations/twogis/client/dto/out/organization-reviews.out.dto";

export interface ITwogisClient {
    getOrganizationReviews(
        organizationExternalId: string,
        payload: GetOrganizationReviewsInDto,
    ): Promise<IOrganizationReviewsOutDto | null>
}
