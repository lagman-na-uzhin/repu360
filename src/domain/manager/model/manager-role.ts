import {UniqueID} from "@domain/common/unique-id";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";
import {MANAGER_TYPE} from "@domain/manager/types/manager-role.types";

export enum MANAGER_PERMISSION_RESOURCE {
    PARTNER = "PARTNER"
}

export enum MANAGER_PERMISSION_ACTION {
    CREATE = "CREATE"
}


export class ManagerRoleId extends UniqueID {}

export class ManagerRole {
    private constructor(
        private readonly _id: ManagerRoleId,
        private _name: string,
        private _type: MANAGER_TYPE,
        private _permissions: ManagerPermission[],

        private readonly _createdAt: Date = new Date(),
        private _updatedAt: Date | null = null,
        private _deletedAt: Date | null = null
    ) {}

    static create(type: MANAGER_TYPE, permissions: ManagerPermission[], name?: string) {
        return new ManagerRole(new ManagerRoleId(), name || type, type, permissions);
    }

    static fromPersistence(id: string, name: string, type: MANAGER_TYPE, permissions: ManagerPermission[]) {
        return new ManagerRole(new ManagerRoleId(id), name, type, permissions);
    }

    hasPermission(resource: MANAGER_PERMISSION_RESOURCE, action: MANAGER_PERMISSION_ACTION): boolean {
        return this._permissions.some(p => p._action === action && p._resource === resource);
    }

}
