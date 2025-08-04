import {FilterParams, GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {OrganizationId} from "@domain/organization/organization";
import {GroupId} from "@domain/organization/group";
import {PlacementId} from "@domain/placement/placement";

export interface GetReviewListFilterParams extends FilterParams {
    readonly organizationId: OrganizationId | null;
    readonly placementId: PlacementId | null;
    readonly tone: 'positive' | 'negative' | null;
    readonly platform: PLATFORMS | null;
}
export interface GetReviewListParams extends GetListParams<GetReviewListFilterParams> {}
