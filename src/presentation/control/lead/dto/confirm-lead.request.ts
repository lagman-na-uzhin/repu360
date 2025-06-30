import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LeadId } from "@domain/lead/lead";
import {OrganizationCountRange, TariffFeatures} from "@domain/subscription/model/tariff-feature";
import {LeadContactCompanyName} from "@domain/manager/value-object/lead/lead-contact-company-name.vo";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";


export enum TariffType {
    BASIC = "BASIC",
    PRO = "PRO",
    PRO_PLUS = "PRO+",
    CUSTOM = "CUSTOM",
}

export class ConfirmLeadRequestDto {
    @IsNotEmpty({ message: 'Lead ID is required' })
    @IsString({ message: 'Lead ID must be a string' })
    @Transform(({ value }) => new LeadId(value))
    readonly leadId: LeadId;

    @IsNotEmpty({ message: 'Tariff type is required' })
    @IsEnum(TariffType, { message: 'Invalid tariff type' })
    readonly tariffType: TariffType;

    @IsNotEmpty({ message: 'Organization count range is required' })
    @IsString({ message: 'Organization count range must be a string' })
    readonly organizationCountRange: OrganizationCountRange;

    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null ? new LeadContactCompanyName(value) : undefined)
    readonly companyName?: LeadContactCompanyName;

    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null ? new LeadContactName(value) : undefined)
    readonly contactName?: LeadContactName;

    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null ? new LeadContactPhone(value) : undefined)
    readonly contactPhone?: LeadContactPhone;

    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null ? new LeadContactEmail(value) : undefined)
    readonly contactEmail?: LeadContactEmail;

    @IsOptional()
    @Transform(({ value }) => {
        if (value !== undefined && value !== null) {
            return TariffFeatures.fromPersistence(
                value.companyDataSync,
                value.multiAccess,
                value.registerPlacement,
                value.reviewReply,
                value.reviewAutoReply,
                value.reviewComplaint,
                value.reviewAutoComplaint,
                value.analysisReview,
                value.analysisByRadius,
                value.analysisCompetitor
            );
        }
        return undefined;
    })
    readonly features?: TariffFeatures;
}
