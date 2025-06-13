import {FilterParams, GetListParams} from "@domain/common/repositories/get-list.interface";
import {CompanyId} from "@domain/company/company";

export interface GetOrganizationListByCompanyFilter extends FilterParams{
    readonly companyId: CompanyId
}
export interface GetOrganizationListByCompanyParams extends GetListParams<GetOrganizationListByCompanyFilter> {}
