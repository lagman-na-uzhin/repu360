import {UniqueID} from "@domain/common/unique-id";
import {EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {ManagerPermissions} from "@domain/policy/model/manager-permissions";
import {RoleType} from "@domain/policy/value-object/role/type.vo";



export class RoleId extends UniqueID {}

export class Role {
    private constructor(
       private readonly _id: RoleId,
       private _name: string | null,
       private _type: RoleType,
       private _permissions: EmployeePermissions | ManagerPermissions
    ) {}

    static create(type: RoleType, permissions: EmployeePermissions, name?: string) {
        return new Role(new RoleId(), name || null, type, permissions);
    }

    static fromPersistence(id: string, name: string | null, type: string, permissions: EmployeePermissions | ManagerPermissions) {
        return new Role(new RoleId(id), name, new RoleType(type), permissions);
    }

    get id() {
        return this._id
    }
    get permissions() {
        return this._permissions;
    }
    get name() {
        return this._name
    }
    get type() {
        return this._type
    }
}
