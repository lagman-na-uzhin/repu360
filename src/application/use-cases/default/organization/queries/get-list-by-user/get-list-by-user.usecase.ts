import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {BaseQuery} from "@application/common/base-query";
import {Organization, OrganizationId} from "@domain/organization/organization";

export class GetUserPermittedOrganizationListUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    async execute(query: BaseQuery) {
        const organizationPermissions = query.actor.role.employeePermissions.organizations;
        console.log(organizationPermissions, "permission")
        const permittedOrganizationIds: OrganizationId[] = [];

        organizationPermissions.forEach((_perms, key) => {
            if (key !== '*') {
                permittedOrganizationIds.push(new OrganizationId(key));
            }
        });
        console.log(permittedOrganizationIds, "permittedOrganizationIds")
        return this.organizationRepo.getByIds(permittedOrganizationIds);
    }
}
