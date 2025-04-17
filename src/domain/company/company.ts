import {UniqueID} from '@domain/common/unique-id';
import {ManagerId} from "@domain/manager/manager";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class CompanyId extends UniqueID {}

export class Company {
    private constructor(
      private readonly _id: CompanyId,
      private readonly _managerId: ManagerId,
      private _name: CompanyName,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
    ) {}

    static create(managerId: ManagerId, name: CompanyName): Company {
        return new Company(new CompanyId(), managerId, name);
    }

    static fromPersistence(id: string, managerId: string, name: string): Company {
        return new Company(
            new CompanyId(id),
            new ManagerId(managerId),
            new CompanyName(name)
        );
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get managerId() {
        return this._managerId;
    }

    get subscriptionId() {
        return this._subscriptionId;
    }
}
