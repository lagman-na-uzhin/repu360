import {UniqueID} from "@domain/common/unique-id";
import {LeadContact} from "@domain/lead/model/lead-contact";
import {ManagerId} from "@domain/manager/manager";

export class LeadId extends UniqueID {}

export class Lead {
    private constructor(
       private readonly _id: LeadId,
       private readonly _contact: LeadContact,
       private _managerId: ManagerId | null,
       private _processedAt: Date | null,

       private readonly _createdAt: Date = new Date(),
    ) {}

    static create(contact: LeadContact) {
        return new Lead(new LeadId(), contact, null, null);
    }

    static fromPersistence(
        id: string,
        contact: LeadContact,
        managerId: string | null,
        processedAt: Date | null,
        createdAt: Date
    ) {
        return new Lead(
            new LeadId(id),
            contact,
            managerId ? new ManagerId(managerId) : null,
            processedAt,
            createdAt
        )
    }

    get id() {return this._id}
    get contact() {return this._contact;}
    get managerId(): ManagerId | null {return this._managerId}
    get processedAt() {return this._processedAt}
    get createdAt() {return this._createdAt}

    set managerId(managerId: ManagerId) {this._managerId = managerId}
}
