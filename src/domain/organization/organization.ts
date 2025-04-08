import { UniqueEntityID } from '@domain/common/unique-id';
import { CompanyId } from '@domain/company/company';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import { EmployeeId } from "@domain/employee/employee";

export class OrganizationId extends UniqueEntityID {}

export class Organization {
  private constructor(
    private readonly _id: OrganizationId,
    private readonly _companyId: CompanyId,
    private _name: string,
    private employeeAccessIds: Array<EmployeeId> = [],

    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date | null = null,
    private _deletedAt: Date | null = null
  ) {}

  static create(companyId: CompanyId, name: string): Organization {
    return new Organization(new OrganizationId(), companyId, name);
  }

  static fromPersistence(id: string, companyId: string, name: string): Organization {
    return new Organization(new OrganizationId(id), new CompanyId(companyId), name);
  }


  set name(newName: string) {
    if (!newName.trim()) {
      throw new Error(EXCEPTION.ORGANIZATION.INVALID_NAME);
    }
    this._name = newName;
  }


  get id(): UniqueEntityID {
    return this._id;
  }

  get companyId(): CompanyId {
    return this._companyId;
  }

  get name(): string {
    return this._name;
  }
}
