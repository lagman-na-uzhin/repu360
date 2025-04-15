import { OrganizationId } from "@domain/organization/organization";


export class EmployeePermissions {
    constructor(
        public readonly companies: Set<string> = new Set(),
        public readonly reviews: Map<OrganizationId, Set<string>> = new Map(),
    ) {}

    // grantOrganizationPermission(
    //     orgId: OrganizationId | AllOrganizations,
    //     permission: OrganizationPermission
    // ): EmployeePermissions

}
