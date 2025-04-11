import {UniqueID} from "@domain/common/unique-id";
import {EmployeeType} from "@domain/employee/value-object/employee-role/employee-type.vo";
import {EmployeePermissions} from "@domain/employee/model/employee-permissions";


export class EmployeeRoleId extends UniqueID {}

export class EmployeeRole {
    private constructor(
       private readonly _id: EmployeeRoleId,
       private _name: string | null,
       private _type: EmployeeType,
       private _permissions: EmployeePermissions
    ) {}

    static create(type: EmployeeType, permissions: EmployeePermissions, name?: string) {
        return new EmployeeRole(new EmployeeRoleId(), name || null, type, permissions);
    }

    static fromPersistence(id: string, name: string, type: EmployeeType, permissions: EmployeePermissions) {
        return new EmployeeRole(new EmployeeRoleId(id), name, type, permissions);
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
