import {UniqueEntityID} from "@domain/common/unique-id";
import {EMPLOYEE_TYPE} from "@domain/company/types/employee-type.types";
import {
    EmployeePermissions,
    PermissionAction,
    PermissionResource
} from "@domain/company/types/employee-permissions.types";


export class EmployeeRoleId extends UniqueEntityID {}

export class EmployeeRole {
    private constructor(
       private readonly _id: EmployeeRoleId,
       private _name: string,
       private _type: EMPLOYEE_TYPE,
       private _permissions: EmployeePermissions
    ) {}

    static create(type: EMPLOYEE_TYPE, permissions: EmployeePermissions[], name?: string) {
        return new EmployeeRole(new EmployeeRoleId(), name || type, type, permissions);
    }

    static fromPersistence(id: string, name: string, type: EMPLOYEE_TYPE, permissions: EmployeePermission[]) {
        return new EmployeeRole(new EmployeeRoleId(id), name, type, permissions);
    }

    addPermission<T extends PermissionResource>(
        resource: T,
        action: PermissionAction<T>
    ) {
        const actions = EmployeePermissions[resource];
        if (!actions.includes(action)) {
            actions.push(action);
        }
    }

    get name() {
        return this._name
    }

    get type() {
        return this._type
    }
}
