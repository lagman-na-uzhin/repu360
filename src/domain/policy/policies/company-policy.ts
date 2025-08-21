import {Actor} from "@domain/policy/actor";
import {ManagerCompanyPermission} from "@domain/policy/model/control/manager-company.permission.enum";
import {DefaultCompanyPermission} from "@domain/policy/model/default/default-company-permission.enum";

export class CompanyPolicy {
    constructor() {}

    static canCreateCompany(actor: Actor): boolean {
        if (CompanyPolicy.#isActorManagerOrAdmin(actor)) {
            return actor.role.controlPermissions.hasCompanyPermission(ManagerCompanyPermission.CAN_CREATE_COMPANY);
        }
        return false;
    }

    static canUpdateCompany(actor: Actor): boolean {
        if (CompanyPolicy.#isActorManagerOrAdmin(actor)) {
            const managerPermissions = actor.role.controlPermissions;
            return managerPermissions.hasCompanyPermission(ManagerCompanyPermission.CAN_EDIT_COMPANY);
        }

        const employeePermissions = actor.role.defaultPermissions;
        if (employeePermissions) {
            return employeePermissions.hasCompanyPermission(DefaultCompanyPermission.CAN_EDIT_COMPANY_DATA);
        }

        return false;
    }

    static canAddOrganizationToCompany(actor: Actor): boolean {
        if (CompanyPolicy.#isActorManagerOrAdmin(actor)) return true;

        const employeePermissions = actor.role.defaultPermissions;
        if (employeePermissions) {
            // Error here fixed by correct enum import
            return employeePermissions.hasCompanyPermission(DefaultCompanyPermission.CAN_ADD_ORGANIZATION_TO_COMPANY);
        }

        return false;
    }

    static #isActorManagerOrAdmin(actor: Actor): boolean {
        return actor.role.isAdmin() || actor.role.isManager();
    }
}
