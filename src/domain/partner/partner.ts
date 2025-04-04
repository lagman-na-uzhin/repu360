import { UniqueEntityID } from '@domain/common/unique-id';
import { PartnerUser } from '@domain/partner/model/partner-user/partner-user';
import { PartnerTariff } from '@domain/partner/model/tariff/partner-tariff';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import { PARTNER_USER_TYPE } from "@domain/partner/model/partner-user/partner-user-role";
import { ManagerId } from "@domain/manager/manager";

export class PartnerId extends UniqueEntityID {}

export class Partner {
    private constructor(
      private readonly _id: PartnerId,
      private readonly managerId: ManagerId,
      private _companyName: string,
      private _tariff: PartnerTariff | null,
      private _users: PartnerUser[] = []
    ) {}

    addUser(user: PartnerUser): void {
        if (user.role.type === PARTNER_USER_TYPE.PARTNER_OWNER) {
            const ownerExists = this._users.some(u => u.role.type === PARTNER_USER_TYPE.PARTNER_OWNER);
            if (ownerExists) throw new Error(EXCEPTION.PARTNER.OWNER_ALREADY_EXISTS);
        }
        this._users.push(user);
    }

    static create(managerId: ManagerId, companyName: string, tariff: PartnerTariff | null, users: PartnerUser[]): Partner {
        return new Partner(new PartnerId(),managerId, companyName, tariff, users);
    }
    static fromPersistence(id: string, managerId: string, companyName: string, tariff: PartnerTariff | null, users: PartnerUser[]): Partner {
        return new Partner(new PartnerId(id), new ManagerId(managerId), companyName, tariff, users);
    }
    set companyName(name: string) {
        if (!name.trim()) {
            throw new Error(EXCEPTION.PARTNER.INVALID_COMPANY_NAME);
        }
        this._companyName = name;
    }

    set tariff(newTariff: PartnerTariff | null) {
        this._tariff = newTariff;
    }

    get users(): PartnerUser[] {
        return this._users;
    }

    get tariff(): PartnerTariff | null {
        return this._tariff;
    }

    get id(): PartnerId {
        return this._id;
    }

    get companyName(): string {
        return this._companyName;
    }
}
