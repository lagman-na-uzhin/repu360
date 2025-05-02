import { Transform } from 'class-transformer';
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";
import {ManagerPassword} from "@domain/manager/value-object/manager-password.vo";

export class EmployeeLoginDto {
    @Transform(({ value }) => new EmployeeEmail(value.toLowerCase()))
    public email: EmployeeEmail;

    @Transform(({ value }) => new EmployeePassword(value))
    public password: EmployeePassword;
}

export class ManagerLoginDto {
    @Transform(({ value }) => new ManagerEmail(value.toLowerCase()))
    public email: ManagerEmail;

    @Transform(({ value }) => new ManagerPassword(value))
    public password: ManagerPassword;
}
