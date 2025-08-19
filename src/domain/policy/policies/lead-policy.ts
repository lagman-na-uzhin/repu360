import { Actor } from "@domain/policy/actor"; // Путь к Actor
import {OrganizationId} from "@domain/organization/organization";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {ManagerLeadPermission} from "@domain/policy/model/manager/manager-lead-permission.enum"; // Путь к ManagerLeadPermission

export class LeadPolicy {
    constructor() {}

    /**
     * @method canAssignManager
     * @description Проверяет, может ли актор назначать менеджера на лид.
     * Требуется роль менеджера/админа и соответствующее разрешение.
     * @param actor Объект актора, включающий информацию о роли.
     * @param targetOrganizationId ID организации, к которой относится лид (опционально, если права гранулярны).
     * @returns boolean True, если актор имеет право, иначе false.
     */
    static canAssignManager(actor: Actor, targetOrganizationId?: OrganizationId): boolean {
        if (actor.role.isManager() && actor.role.isAdmin()) return false;

        const managerPermissions = actor.role.managerPermissions;

        return managerPermissions.hasLeadPermission(
            targetOrganizationId || "*",
            ManagerLeadPermission.ASSIGN_LEADS_TO_ANYONE
        );
    }

    /**
     * @method canAssignHimselfAsManager
     * @description Проверяет, может ли актор назначить себя менеджером на лид.
     * Требуется роль менеджера/админа и соответствующее разрешение.
     * @param actor Объект актора, включающий информацию о роли.
     * @param targetOrganizationId ID организации, к которой относится лид (опционально).
     * @returns boolean True, если актор имеет право, иначе false.
     */
    static canAssignHimselfAsManager(actor: Actor, targetOrganizationId?: OrganizationId): boolean {
        if (actor.role.isManager() && actor.role.isAdmin()) return false;

        const managerPermissions = actor.role.managerPermissions;

        return managerPermissions.hasLeadPermission(
            targetOrganizationId || "*",
            ManagerLeadPermission.ASSIGN_SELF_AS_MANAGER
        );
    }
}
