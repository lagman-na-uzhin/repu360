import {Actor} from "@domain/policy/actor";
import {ManagerLeadPermission} from "@domain/policy/manager-permissions/manager-lead-permissions";

export class LeadPolicy {
    constructor() {}

    static canAssignManager(actor: Actor): boolean {
        if (!actor.role.isManager() || !actor.role.isAdmin()) {
            return false;
        }

        return actor.role.managerPermissions.leads.has(ManagerLeadPermission.CAN_ASSIGN_MANAGER);

    }
    static canAssignHimselfAsManager(actor: Actor): boolean {
        if (!actor.role.isManager() || !actor.role.isAdmin()) {
            return false;
        }

        return actor.role.managerPermissions.leads.has(ManagerLeadPermission.CAN_ASSIGN_HIMSELF_AS_MANAGER);
    }
}
