import {FilterParams, GetListParams} from "@domain/common/repositories/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {OrganizationId} from "@domain/organization/organization";
import {GroupId} from "@domain/organization/group";

export interface GetReviewListFilterParams extends FilterParams {
    readonly companyId: CompanyId;
    readonly groupId: GroupId | null;
    readonly organizationId: OrganizationId | null;
    readonly tone: 'positive' | 'negative' | null;
    readonly platform: PLATFORMS | null;
}
export interface GetReviewListParams extends GetListParams<GetReviewListFilterParams> {}
