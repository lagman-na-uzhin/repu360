import {
    COMPANY_PERMISSIONS,
    CompanyPermission
} from "@domain/employee/value-object/employee-permissions/company-permissions.vo";
import { OrganizationId } from "@domain/organization/organization";
import {
    REVIEW_PERMISSIONS,
    ReviewPermission
} from "@domain/employee/value-object/employee-permissions/review-permissions.vo";

const ALL_ORGANIZATIONS = "ALL_ORGANIZATIONS" as const
type AllOrganizations = "ALL_ORGANIZATIONS"

export class EmployeePermissions {
    constructor(
        public readonly company: Set<CompanyPermission> = new Set(),
        public readonly reviews: Map<OrganizationId | AllOrganizations, Set<ReviewPermission>> = new Map(),
    ) {}

    static owner(): EmployeePermissions {
        return new EmployeePermissions(
            new Set(COMPANY_PERMISSIONS),
            new Map().set(ALL_ORGANIZATIONS, new Set(REVIEW_PERMISSIONS)),
        );
    }

    canEditCompanyData(): boolean {
        return this.company.has("CAN_EDIT_COMPANY_DATA");
    }

    canEditOwner(): boolean {
        return this.company.has("CAN_EDIT_OWNER");
    }

    // grantOrganizationPermission(
    //     orgId: OrganizationId | AllOrganizations,
    //     permission: OrganizationPermission
    // ): EmployeePermissions

}
