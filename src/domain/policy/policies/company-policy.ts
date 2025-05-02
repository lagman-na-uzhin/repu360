import {Actor} from "@domain/policy/actor";
import {ManagerCompanyPermission} from "@domain/policy/manager-permissions/manager-company-permissions";
import {EmployeeCompanyPermission} from "@domain/policy/employee-permissions/manager-company-permissions";

export class CompanyPolicy {
    constructor() {}

    static canCreateCompany(actor: Actor) {
        if (actor.role.isAdmin() || actor.role.isManager()) {
            const permissions = actor.role.managerPermissions;
            console.log(permissions, 'permissions')
            return permissions.companies?.has(ManagerCompanyPermission.CAN_CREATE_COMPANY);
        }
        return false;
    }

    static canAddOrganizationToCompany(actor: Actor) {
        const isManager = actor.role.isManager() || actor.role.isAdmin();

        if (isManager) return true;
        else return actor.role.employeePermissions.companies?.has(EmployeeCompanyPermission.CAN_ADD_ORGANIZATION_TO_COMPANY)
    }
}
