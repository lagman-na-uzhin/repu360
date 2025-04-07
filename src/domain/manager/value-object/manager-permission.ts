import {MANAGER_PERMISSION_ACTION, MANAGER_PERMISSION_RESOURCE} from "@domain/manager/model/manager-role";

export class ManagerPermission {
    private constructor(
        readonly _resource: MANAGER_PERMISSION_RESOURCE,
        readonly _action: MANAGER_PERMISSION_ACTION,
    ) {}

    static create(resource: MANAGER_PERMISSION_RESOURCE, action: MANAGER_PERMISSION_ACTION) {
        return new ManagerPermission(resource, action);
    }
}
