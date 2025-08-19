import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {
    QSOrganizationCompactDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-compact.dto";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {QSOrganizationDto} from "@application/interfaces/query-services/organization-qs/dto/response/organization.dto";
import {
    GetCompactOrganizationQuery
} from "@application/use-cases/default/organization/queries/get-organization-compact/get-compact-organization.query";
import {
    QSOrganizationSummaryDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organizarion-summaty.dto";
import {GetSummaryQuery} from "@application/use-cases/default/organization/queries/get-summary/get-summary.query";

export interface IOrganizationQs {
    getList(query: GetOrganizationListQuery): Promise<PaginatedResult<QSOrganizationDto>>
    getCompactOrganizations(query: GetCompactOrganizationQuery): Promise<QSOrganizationCompactDto[]>
    getSummary(query: GetSummaryQuery): Promise<QSOrganizationSummaryDto>
}
