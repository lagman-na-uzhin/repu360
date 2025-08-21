import { Transform } from 'class-transformer';
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";
import {ManagerPassword} from "@domain/manager/value-object/manager-password.vo";

export class EmployeeLoginDto {
    @Transform(({ value }) => EmployeeEmail.of(value))
    public email: EmployeeEmail;

    @Transform(({ value }) => EmployeePassword.of(value))
    public password: EmployeePassword;
}

export class ManagerLoginDto {
    @Transform(({ value }) => ManagerEmail.of(value))
    public email: ManagerEmail;

    @Transform(({ value }) => ManagerPassword.of(value))
    public password: ManagerPassword;
}
