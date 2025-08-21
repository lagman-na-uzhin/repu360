import {UniqueID} from "@domain/common/unique-id";
import {DefaultPermissions} from "@domain/policy/model/default-permissions";
import {ControlPermissions} from "@domain/policy/model/control-permissions";
import {RoleType} from "@domain/policy/types/role-type.enum";


export class RoleId extends UniqueID {}

export class Role {
    private constructor(
       private readonly _id: RoleId,
       private _name: string,
       private _type: RoleType,
       private _permissions: DefaultPermissions | ControlPermissions
    ) {}

    static create(type: RoleType, permissions: DefaultPermissions, name: string) {
        return new Role(new RoleId(), name, type, permissions);
    }

    static fromPersistence(id: string, name: string, type: string, permissions: DefaultPermissions | ControlPermissions) {
        return new Role(new RoleId(id), name, type as RoleType, permissions);
    }

    static createCompanyOwnerRole() {
        const ownerPermissions = DefaultPermissions.owner();
        return new Role(new RoleId(), 'Owner', RoleType.OWNER, ownerPermissions)
    }

    get defaultPermissions(): DefaultPermissions {
        if (this.isAdmin() && this.isManager()) {
            throw new Error("Error: The role must be either Owner or Employee to retrieve permissions.");
        }

        if (this._permissions instanceof DefaultPermissions) {
            return this._permissions;
        }

        throw new Error("Error: Permissions are not of type EmployeePermissions.");
    }

    get controlPermissions(): ControlPermissions {
        if (this.isEmployee() && this.isOwner()) {
            throw new Error("Error: Cannot retrieve control permissions when both Employee and Owner roles are present.");
        }

        if (this._permissions instanceof ControlPermissions) {
            return this._permissions;
        }

        throw new Error("Error: Permissions are not of type ManagerPermissions.");
    }


    get id() {return this._id}
    get name() {return this._name}
    get type() {return this._type}

    public isManager(): boolean {
        return this._type === RoleType.MANAGER;
    }

    public isAdmin(): boolean {
        return this._type === RoleType.ADMIN;
    }

    public isOwner(): boolean {
        return this._type === RoleType.OWNER;
    }

    public isEmployee(): boolean {
        return this._type === RoleType.EMPLOYEE;
    }


}
