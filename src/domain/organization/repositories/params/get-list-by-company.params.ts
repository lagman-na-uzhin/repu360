import {FilterParams, GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";

export interface GetOrganizationListByCompanyFilter extends FilterParams{
    readonly companyId: CompanyId,
    readonly isActive?: boolean,
    readonly isTemporarilyClosed?: boolean,
}
export interface GetOrganizationListByCompanyParams extends GetListParams<GetOrganizationListByCompanyFilter> {}
