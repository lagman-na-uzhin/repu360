import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {BaseQuery} from "@application/common/base-query";
import {Organization} from "@domain/organization/organization";

export class GetUserPermittedOrganizationListUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    async execute(query: BaseQuery): Promise<Organization[]> {
        // Get the IDs of organizations to which the actor has any permissions
        const permittedOrganizationIds = Array.from(query.actor.role.employeePermissions.organizations.keys())

        return this.organizationRepo.getByIds(permittedOrganizationIds);
    }
}
