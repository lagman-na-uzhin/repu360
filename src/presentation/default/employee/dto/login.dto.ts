import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import {EmployeeDto} from "@presentation/common/dto/employee-body-dto";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    public email: string;

    @IsNotEmpty()
    @IsString()
    public password: string;
}
