import {UniqueID} from "@domain/common/unique-id";
import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";

export class LeadContactId extends UniqueID {}

export class LeadContact {
    private constructor(
        private readonly _id: LeadContactId,
        private readonly _phone: LeadContactPhone,
        private readonly _name: LeadContactName,
        private readonly _email: LeadContactEmail,
    ) {}

    get id() {
        return this._id;
    }

    get phone() {
        return this._phone
    }

    get name() {
        return this._name
    }

    get email() {
        return this._email;
    }
}
