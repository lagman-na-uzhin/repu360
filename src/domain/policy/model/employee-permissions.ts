import { OrganizationId } from "@domain/organization/organization";
import {EmployeeCompanyPermission} from "@domain/policy/employee-permissions/manager-company-permissions";
import {EmployeeReviewPermission} from "@domain/policy/employee-permissions/manager-review-permissions";


export class EmployeePermissions {
    constructor(
        public readonly companies: Set<string> = new Set(),
        public readonly reviews: Map<OrganizationId, Set<string>> = new Map(),
    ) {}

    static owner(): EmployeePermissions {
        const allCompanyPermissions = new Set<string>(
            Object.values(EmployeeCompanyPermission)
        );

        return new EmployeePermissions(allCompanyPermissions);

        // grantOrganizationPermission(
        //     orgId: OrganizationId | AllOrganizations,
        //     permission: OrganizationPermission
        // ): EmployeePermissions
    }
}
