import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {LeadId} from "@domain/lead/lead";
import {LeadContactCompanyName} from "@domain/manager/value-object/lead/lead-contact-company-name.vo";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";
import {OrganizationCountRange, TariffFeatures} from "@domain/subscription/model/tariff-feature";

export class ConfirmLeadCommand extends BaseCommand {
    private constructor(
        public readonly leadId: LeadId,
        actor: Actor,
        public readonly tariffType: "BASIC" | "PRO" | "PRO+" | "CUSTOM",
        public readonly organizationCountRange: OrganizationCountRange,
        public readonly companyName?: LeadContactCompanyName,
        public readonly contactName?: LeadContactName,
        public readonly contactPhone?: LeadContactPhone,
        public readonly contactEmail?: LeadContactEmail,
        public readonly features?: TariffFeatures,
        public readonly customPrice?: number,
        public readonly priceChangedReason?: string,
    ) {
        super(actor);
    }

    static of(
        dto: {
            leadId: LeadId,
            tariffType: "BASIC" | "PRO" | "PRO+" | "CUSTOM",
            organizationCountRange: OrganizationCountRange,
            companyName?: LeadContactCompanyName,
            contactName?: LeadContactName,
            contactPhone?: LeadContactPhone,
            contactEmail?: LeadContactEmail,
            features?: TariffFeatures,
            customPrice?: number,
            priceChangedReason?: string
        },
        actor: Actor) {
        if (dto.tariffType === "CUSTOM") {
            if (!dto?.features) {
                throw new Error("Tariff Features is required")
            }
            if (dto?.customPrice && !dto?.priceChangedReason) {
                throw new Error("If a custom price is provided, a reason for the price change is required.");
            }
        }
        return new ConfirmLeadCommand(
            dto.leadId,
            actor,
            dto.tariffType,
            dto.organizationCountRange,
            dto.companyName,
            dto.contactName,
            dto.contactPhone,
            dto.contactEmail,
            dto.features
        );
    }
}
