import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";
import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {LeadContactCompanyName} from "@domain/manager/value-object/lead/lead-contact-company-name.vo";

export class CreateLeadRequestDto {
    @IsNotEmpty({ message: 'Company Name is required' })
    @IsString({ message: 'Company Name must be a string' })
    @Transform(({ value }) => new LeadContactCompanyName(value))
    readonly companyName: LeadContactCompanyName;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @Transform(({ value }) => new LeadContactName(value))
    readonly name: LeadContactName;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid mail address' })
    @Transform(({ value }) => new LeadContactEmail(value))
    readonly email: LeadContactEmail;


    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    @Transform(({ value }) => new LeadContactPhone(value))
    readonly phone: LeadContactPhone;
}
