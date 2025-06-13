import {IsNotEmpty, IsString} from 'class-validator';
import { Transform } from 'class-transformer';
import {ManagerId} from "@domain/manager/manager";
import {LeadId} from "@domain/lead/lead";

export class AssignManagerRequestDto {
    @IsNotEmpty({ message: 'Lead ID is required' })
    @IsString({ message: 'Lead ID must be a string' })
    @Transform(({ value }) => new LeadId(value))
    readonly leadId: LeadId;

    @IsString({ message: 'manager ID must be a string' })
    @Transform(({ value }) => value ? new ManagerId(value) : undefined)
    readonly managerId?: ManagerId;
}
