import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";
import {LeadContactCompanyName} from "@domain/manager/value-object/lead/lead-contact-company-name.vo";


export class LeadContact {
    private constructor(
        private readonly _company_name: LeadContactCompanyName,
        private readonly _phone: LeadContactPhone,
        private readonly _name: LeadContactName,
        private readonly _email: LeadContactEmail,
    ) {}

    static create(companyName: LeadContactCompanyName, phone: LeadContactPhone, name: LeadContactName, email: LeadContactEmail) {
        return new LeadContact(
            companyName,
            phone,
            name,
            email
        )
    }

    static fromPersistence(companyName: string, phone: string, name: string, email: string) {
        return new LeadContact(
            new LeadContactCompanyName(companyName),
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

    get companyName() {
        return this._company_name;
    }
}
