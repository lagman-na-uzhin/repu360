import {UniqueEntityID} from "@domain/common/unique-id";
import {ManagerPermission} from "@domain/manager/value-object/manager-permission";

export enum PARTNER_USER_TYPE {
    PARTNER_OWNER = "PARTNER_OWNER",
    PARTNER_EMPLOYEE = 'PARTNER_EMPLOYEE',
}

export class PartnerUserRoleId extends UniqueEntityID {}

export class PartnerUserRole {
    private constructor(
       private readonly _id: PartnerUserRoleId,
       private _name: string,
       private _type: PARTNER_USER_TYPE,
       private _permissions: ManagerPermission[]
    ) {}

    static create(type: PARTNER_USER_TYPE, permissions: ManagerPermission[], name?: string) {
        return new PartnerUserRole(new PartnerUserRoleId(), name || type, type, permissions);
    }

    static fromPersistence(id: string, name: string, type: PARTNER_USER_TYPE, permissions: ManagerPermission[]) {
        return new PartnerUserRole(new PartnerUserRoleId(id), name, type, permissions);
    }

    get type() {
        return this._type
    }
}
