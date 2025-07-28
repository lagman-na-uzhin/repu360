import {FilterParams, GetListParams} from "@domain/common/repositories/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {OrganizationId} from "@domain/organization/organization";
import {GroupId} from "@domain/organization/group";

export interface GetEmployeeListFilterParams extends FilterParams {
    readonly companyId: CompanyId;
}
export interface GetEmployeeListParams extends GetListParams<GetEmployeeListFilterParams> {}
