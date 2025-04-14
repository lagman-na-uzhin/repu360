import {UniqueID} from '@domain/common/unique-id';
import {ManagerId} from "@domain/manager/manager";
import {CompanyName} from "@domain/company/value-object/company-name.vo";
import {SubscriptionId} from "@domain/subscription/subscription";
import {EmployeeId} from "@domain/employee/employee";

export class CompanyId extends UniqueID {}

export class Company {
    private constructor(
      private readonly _id: CompanyId,
      private readonly _managerId: ManagerId,
      private readonly _subscriptionId: SubscriptionId | null,
      private _name: CompanyName,

      private readonly _createdAt: Date = new Date(),
      private _updatedAt: Date | null = null,
      // private _deletedAt: Date | null = null
    ) {}

    static create(managerId: ManagerId, subscriptionId: SubscriptionId | null, name: CompanyName): Company {
        return new Company(new CompanyId(), managerId, subscriptionId, name);
    }

    static fromPersistence(id: string, ownerId: string, managerId: string, subscriptionId: string, name: string): Company {
        return new Company(
            new CompanyId(id),
            new ManagerId(managerId),
            new SubscriptionId(subscriptionId),
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
