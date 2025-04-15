import {Actor} from "@domain/policy/actor";
import {RoleTypes} from "@domain/policy/types/role.types";
import {ManagerPermissions} from "@domain/manager/model/manager-permissions";
import {ManagerCompanyPermission} from "@domain/policy/manager-permissions/manager-company-permissions";

export class CompanyPolicy {
    constructor() {}

    static canCreateCompany(actor: Actor) {
        if (actor.role.type === RoleTypes.Manager || actor.role.type === RoleTypes.Admin) {
            const permissions = actor.role.permissions as ManagerPermissions;
            return permissions.companies?.has(ManagerCompanyPermission.CAN_CREATE_COMPANY);
        }
        return false;
    }
}
