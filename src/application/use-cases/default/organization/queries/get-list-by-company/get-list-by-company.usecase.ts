import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {Organization} from "@domain/organization/organization";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";

export class GetOrganizationListUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    async execute(query: GetOrganizationListQuery): Promise<Organization[]> {
        return this.organizationRepo.getActiveList() //TODO
    }
}
