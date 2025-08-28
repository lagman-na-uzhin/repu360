import { UniqueID } from '@domain/common/unique-id';
import { CompanyId } from '@domain/company/company';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {ContactPoint} from "@domain/organization/value-objects/contact.point.vo";
import {GroupId} from "@domain/organization/group";
import {RubricId} from "@domain/rubric/rubric";
import {OrganizationAddress} from "@domain/organization/value-objects/organization-address.vo";

export class FillialId extends UniqueID {}

export class Fillial extends AggregateRoot<FillialId> {
    private constructor(
        protected readonly _id: FillialId,
        private readonly _companyId: CompanyId,
        private _groupId: GroupId | null,
        private _name: string,
        private _address: OrganizationAddress,
        private _working_schedule: WorkingSchedule,
        private _contact_points: ContactPoint[],
        private _rubricIds: RubricId[],
    ) {super(_id)}

    static create(
        companyId: CompanyId,
        groupId: GroupId | null,
        name: string,
        address: OrganizationAddress,
        workingSchedule: WorkingSchedule,
        contactPoints: ContactPoint[],
        rubrics: RubricId[],
    ): Fillial {
        return new Fillial(
            new FillialId(),
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
        rubricIds: RubricId[],
    ) {
        return new Fillial(
            new FillialId(id),
            new CompanyId(companyId),
            groupId ? new GroupId(groupId) : null,
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


    get id(): FillialId {
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
