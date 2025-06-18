import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {Organization} from "@domain/organization/organization";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";

export class GetOrganizationListUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    async execute(query: GetOrganizationListQuery): Promise<PaginatedResult<Organization>> {
        const result = await this.organizationRepo.getListByCompanyId(query);
        console.log(query.pagination, "query.pagination")
        console.log(result)
        return result;
    }
}
