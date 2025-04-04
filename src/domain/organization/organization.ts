import { UniqueEntityID } from '@domain/common/unique-id';
import { PartnerId } from '@domain/partner/partner';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class OrganizationId extends UniqueEntityID {}

export class Organization {
  private constructor(
    private readonly _id: OrganizationId,
    private readonly _partnerId: PartnerId,
    private _name: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date | null = null,
    private _deletedAt: Date | null = null
  ) {}

  static create(partnerId: PartnerId, name: string): Organization {
    return new Organization(new OrganizationId(), partnerId, name);
  }

  static fromPersistence(id: string, partnerId: string, name: string): Organization {
    return new Organization(new OrganizationId(id), new PartnerId(partnerId), name);
  }

  delete(): void {
    this._deletedAt = new Date();
  }

  set name(newName: string) {
    if (!newName.trim()) {
      throw new Error(EXCEPTION.ORGANIZATION.INVALID_NAME);
    }
    this._name = newName;
    this._updatedAt = new Date();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get partnerId(): UniqueEntityID {
    return this._partnerId;
  }

  get name(): string {
    return this._name;
  }
}
