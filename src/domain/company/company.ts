import {UniqueID} from '@domain/common/unique-id';
import {ManagerId} from "@domain/manager/manager";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class CompanyId extends UniqueID {}

export class Company {
    private constructor(
      private readonly _id: CompanyId,
      private readonly _managerId: ManagerId,
      private _name: CompanyName,
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

    set name(name: CompanyName) {
        this._name = name;
    }

    get managerId() {
        return this._managerId;
    }

    toPlainObject() {
        return {
            id: this._id.toString(),
            managerId: this._managerId.toString(),
            name: this._name.toString()
        }
    }

}
