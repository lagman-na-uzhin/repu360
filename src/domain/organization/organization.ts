import { UniqueID } from '@domain/common/unique-id';
import { CompanyId } from '@domain/company/company';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class OrganizationId extends UniqueID {}

export class Organization {
  private constructor(
    private readonly _id: OrganizationId,
    private readonly _companyId: CompanyId,
    private _name: string,
    private _address: string
  ) {}

  static create(companyId: CompanyId, name: string, address: string): Organization {
    return new Organization(new OrganizationId(), companyId, name, address);
  }

  static fromPersistence(id: string, companyId: string, name: string, address: string) {
    return new Organization(new OrganizationId(id), new CompanyId(companyId), name, address);
  }

  set name(newName: string) {
    if (!newName.trim()) {
      throw new Error(EXCEPTION.ORGANIZATION.INVALID_NAME);
    }
    this._name = newName;
  }


  get id(): UniqueID {
    return this._id;
  }

  get companyId(): CompanyId {
    return this._companyId;
  }

  get name(): string {
    return this._name;
  }

  get address(): string {
    return this._address;
  }

  toPlainObject() {
    return {
      id: this._id.toString(),
      companyId: this._companyId.toString(),
      name: this._name,
      address: this._address
    }
  }
}
