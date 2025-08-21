import {Actor} from "@domain/policy/actor";
import {DefaultEmployeePermission} from "@domain/policy/model/default/default-employee-permission.enum";

export class EmployeePolicy {
    constructor() {
    }

    static canCreateEmployee(actor: Actor): boolean {
        if (EmployeePolicy.#isActorManagerOrAdmin(actor)) {
            return true;
        } else {
            return actor.role.defaultPermissions.hasEmployeePermission(DefaultEmployeePermission.CREATE)

        }
    }

    static #isActorManagerOrAdmin(actor: Actor): boolean {
        return actor.role.isAdmin() || actor.role.isManager();
    }
}
