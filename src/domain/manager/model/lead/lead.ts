import {UniqueID} from "@domain/common/unique-id";
import {LeadContact} from "@domain/manager/model/lead/lead-contact";

export class LeadId extends UniqueID {}

export class Lead {
    private constructor(
       private readonly _id: LeadId,
       private readonly _contact: LeadContact,
       private _processedAt: Date | null = null,

       private readonly _createdAt: Date = new Date(),
       private _deletedAt: Date | null = null
    ) {}

    get contact() {
        return this._contact;
    }
}
