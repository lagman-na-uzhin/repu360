import {UniqueEntityID} from "@domain/common/unique-id";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";

export enum MANAGER_TYPE {
    MANAGER = "MANAGER",
    ADMIN = 'ADMIN',
}

export class ManagerRoleId extends UniqueEntityID {}

export class ManagerRole {
    private constructor(
        private readonly _id: ManagerRoleId,
        private _name: string,
        private _type: MANAGER_TYPE,
        private _permissions: ManagerPermission[]
    ) {}

    static create(type: MANAGER_TYPE, permissions: ManagerPermission[], name?: string) {
        return new ManagerRole(new ManagerRoleId(), name || type, type, permissions);
    }

    static fromPersistence(id: string, name: string, type: MANAGER_TYPE, permissions: ManagerPermission[]) {
        return new ManagerRole(new ManagerRoleId(id), name, type, permissions);
    }
}
