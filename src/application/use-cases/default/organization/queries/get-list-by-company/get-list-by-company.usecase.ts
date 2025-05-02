import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {GetOrganizationListQuery} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";

export class GetOrganizationListUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    async execute(query: GetOrganizationListQuery): Promise<void> {
        return
    }
}
