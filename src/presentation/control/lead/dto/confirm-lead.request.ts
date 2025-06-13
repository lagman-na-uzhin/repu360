import {IsNotEmpty, IsString} from 'class-validator';
import { Transform } from 'class-transformer';
import {LeadId} from "@domain/lead/lead";

export class ConfirmLeadRequestDto {
    @IsNotEmpty({ message: 'Lead ID is required' })
    @IsString({ message: 'Lead ID must be a string' })
    @Transform(({ value }) => new LeadId(value))
    readonly leadId: LeadId;
}
