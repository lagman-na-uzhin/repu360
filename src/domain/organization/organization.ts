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
    private _is_active: boolean,
    private _name: string,
    private _address: OrganizationAddress,
    private _working_schedule: WorkingSchedule | null,
    private _contact_points: ContactPoint[],
    private _rubricIds: RubricId[],
  ) {}

  static create(
      companyId: CompanyId,
      groupId: GroupId | null,
      name: string,
      address: OrganizationAddress,
      workingSchedule: WorkingSchedule | null,
      contactPoints: ContactPoint[],
      rubrics: RubricId[],
      isActive: boolean = true,
  ): Organization | any {
    return new Organization(
        new OrganizationId(),
        companyId,
        groupId,
        isActive,
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
      workingHours: WorkingSchedule | null,
      contactPoints: ContactPoint[],
      rubricIds: RubricId[],
      isActive: boolean = true,
      ) {
    return new Organization(
        new OrganizationId(id),
        new CompanyId(companyId),
        groupId ? new GroupId(groupId) : null,
        isActive,
        name,
        address,
        workingHours,
        contactPoints,
        rubricIds,
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

  get isActive() {
      return this._is_active;
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

  get contactPoints() {return this._contact_points}

  get workingSchedule(): WorkingSchedule | null {
    return this._working_schedule;
  }
  set workingSchedule(schedule: WorkingSchedule) {
    this._working_schedule = schedule
  }

  get rubricIds() {
    return this._rubricIds;
  }

  set rubricIds(rubrics: RubricId[]) {
    this._rubricIds = rubrics;
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
