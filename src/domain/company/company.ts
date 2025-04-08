import {UniqueEntityID} from '@domain/common/unique-id';
import {ManagerId} from "@domain/manager/manager";
import {CompanyName} from "@domain/company/value-object/company-name.vo";
import {SubscriptionId} from "@domain/subscription/subscription";
import {CompanyOwner} from "@domain/company/model/company-owner";

export class CompanyId extends UniqueEntityID {}

export class Company {
    private constructor(
      private readonly _id: CompanyId,
      private readonly _managerId: ManagerId,
      private readonly _subscriptionId: SubscriptionId | null,
      private _name: CompanyName,
      private _owner: CompanyOwner,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      private _deletedAt: Date | null = null
    ) {}

    static create(managerId: ManagerId, subscriptionId: SubscriptionId | null, name: CompanyName, owner: CompanyOwner): Company {
        return new Company(new CompanyId(), managerId, subscriptionId, name, owner);
    }

    static fromPersistence(id: string, managerId: string, name: string): Company {

    }


    set companyName(name: CompanyName) {
        this._name = name;
    }

    get id(): CompanyId {
        return this._id;
    }

    get name(): CompanyName {
        return this._name;
    }
}
