import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";
import {LeadContactCompanyName} from "@domain/manager/value-object/lead/lead-contact-company-name.vo";

export class CreateLeadCommand {
    constructor(
        public readonly companyName: LeadContactCompanyName,
        public readonly phone: LeadContactPhone,
        public readonly name: LeadContactName,
        public readonly email: LeadContactEmail,
    ) {}

    static of(
        payload: {companyName: LeadContactCompanyName, phone: LeadContactPhone, name: LeadContactName, email: LeadContactEmail},
    ) {
        return new CreateLeadCommand(
            payload.companyName,
            payload.phone,
            payload.name,
            payload.email,
        );
    }
}
