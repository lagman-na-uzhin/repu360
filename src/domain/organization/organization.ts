import { UniqueID } from '@domain/common/unique-id';
import { CompanyId } from '@domain/company/company';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {ContactPoint} from "@domain/organization/value-objects/contact.point.vo";
import {GroupId} from "@domain/organization/group";
import {RubricId} from "@domain/rubric/rubric";
import {OrganizationAddress} from "@domain/organization/value-objects/organization-address.vo";

export class OrganizationId extends UniqueID {}

export class Organization {
  private constructor(
    private readonly _id: OrganizationId,
    private readonly _companyId: CompanyId,
    private _groupId: GroupId | null,
    private _name: string,
    private _address: OrganizationAddress,
    private _working_schedule: WorkingSchedule,
    private _contact_points: ContactPoint[],
    private _rubrics: RubricId[],
  ) {}

  static create(
      companyId: CompanyId,
      groupId: GroupId | null,
      name: string,
      address: OrganizationAddress,
      workingSchedule: WorkingSchedule,
      contactPoints: ContactPoint[],
      rubrics: RubricId[],
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
    );
  }

  static fromPersistence(
      id: string,
      companyId: string,
      name: string,
      address: OrganizationAddress,
      groupId: string | null,
      workingHours: WorkingSchedule,
      contactPoints: ContactPoint[],
      rubrics: RubricId[],
      ) {
    return new Organization(
        new OrganizationId(id),
        new CompanyId(companyId),
        groupId ? new GroupId(groupId) : null,
        name,
        address,
        workingHours,
        contactPoints,
        rubrics,
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

  get address(): OrganizationAddress {
    return this._address;
  }


  get workingSchedule() {
    return this._working_schedule;
  }
  set workingSchedule(schedule: WorkingSchedule) {
    this._working_schedule = schedule
  }

  get rubrics() {
    return this._rubrics;
  }

  set rubrics(rubrics: RubricId[]) {
    this._rubrics = rubrics;
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
