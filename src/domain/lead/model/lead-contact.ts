import {UniqueID} from "@domain/common/unique-id";
import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";


export class LeadContact {
    private constructor(
        private readonly _phone: LeadContactPhone,
        private readonly _name: LeadContactName,
        private readonly _email: LeadContactEmail,
    ) {}

    static create(phone: LeadContactPhone, name: LeadContactName, email: LeadContactEmail) {
        return new LeadContact(
            phone,
            name,
            email
        )
    }

    static fromPersistence(phone: string, name: string, email: string) {
        return new LeadContact(
            new LeadContactPhone(phone),
            new LeadContactName(name),
            new LeadContactEmail(email)
        )
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
