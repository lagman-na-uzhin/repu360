import {IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ManagerId} from "@domain/manager/manager";

export class ByIdManagerRequestParamsDto {
    @IsNotEmpty({ message: 'Manager Id is required' })
    @IsString({ message: 'Manager Id must be a string' })
    @Transform(({ value }) => new ManagerId(value))
    readonly managerId: ManagerId;
}
