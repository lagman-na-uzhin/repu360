import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {IOrganizationQs} from "@application/interfaces/query-services/organization-qs/organization-qs.interface";
import {QSOrganizationDto} from "@application/interfaces/query-services/organization-qs/dto/response/organization.dto";

export class GetOrganizationListUseCase {
    constructor(
        private readonly organizationQs: IOrganizationQs,
    ) {}

    async execute(query: GetOrganizationListQuery): Promise<PaginatedResult<QSOrganizationDto>> {
        return this.organizationQs.getList(query);
    }
}
