import {GetOrganizationListByCompanyParams} from "@domain/organization/repositories/params/get-list-by-company.params";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";

export interface IOrganizationQs {
    getList(dto: GetOrganizationListByCompanyParams): Promise<PaginatedResult<any>>
}
