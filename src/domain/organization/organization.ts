import { UniqueID } from '@domain/common/unique-id';
import { CompanyId } from '@domain/company/company';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {ContactPoint} from "@domain/organization/value-objects/contact.point.vo";
import {GroupId} from "@domain/organization/group";
import {Rubric} from "@domain/organization/model/organization-rubrics";

export class OrganizationId extends UniqueID {}

export class Organization {
  private constructor(
    private readonly _id: OrganizationId,
    private readonly _companyId: CompanyId,
    private _groupId: GroupId,
    private _name: string,
    private _address: string,
    private _working_schedule: WorkingSchedule,
    private _contact_points: ContactPoint[],
    private _rubrics: Rubric[],
    private _is_temporarily_closed: boolean
  ) {}

  static create(
      companyId: CompanyId,
      groupId: GroupId,
      name: string,
      address: string,
      workingSchedule: WorkingSchedule,
      contactPoints: ContactPoint[],
      rubrics: Rubric[],
      isTemporarilyClosed: boolean
  ): Organization | any {
    return new Organization(
        new OrganizationId(),
        companyId,
        groupId,
        name,
        address,
        workingSchedule,
        contactPoints,
        rubrics,
        isTemporarilyClosed
    );
  }

  static fromPersistence(
      id: string,
      companyId: string,
      name: string,
      address: string,
      groupId: string,
      workingHours: WorkingSchedule,
      contactPoints: ContactPoint[],
      rubrics: Rubric[],
      isTemporarilyClosed: boolean
      ) {
    return new Organization(
        new OrganizationId(id),
        new CompanyId(companyId),
        new GroupId(groupId),
        name,
        address,
        workingHours,
        contactPoints,
        rubrics,
        isTemporarilyClosed
    );
  }

  set name(newName: string) {
    if (!newName.trim()) {
      throw new Error(EXCEPTION.ORGANIZATION.INVALID_NAME);
    }
    this._name = newName;
  }


  get id(): OrganizationId {
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

  get isTemporarilyClosed() {
    return this._is_temporarily_closed;
  }

  get workingSchedule() {
    return this._working_schedule;
  }

  get rubrics() {
    return this._rubrics;
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
