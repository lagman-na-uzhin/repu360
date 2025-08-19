import { Transform } from 'class-transformer';
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";
import {ManagerPassword} from "@domain/manager/value-object/manager-password.vo";

export class EmployeeLoginDto {
    @Transform(({ value }) => {
        console.log(value, "value")
        console.log(new EmployeeEmail(value.toLowerCase()), "new EmployeeEmail(value.toLowerCase())")
        return new EmployeeEmail(value.toLowerCase())
    })
    public email: EmployeeEmail;

    @Transform(({ value }) => {
        console.log(value, "value")
        console.log(new EmployeePassword(value), "new EmployeePassword(value.toLowerCase())")
        return new EmployeePassword(value)
    })
    public password: EmployeePassword;
}

export class ManagerLoginDto {
    @Transform(({ value }) => new ManagerEmail(value.toLowerCase()))
    public email: ManagerEmail;

    @Transform(({ value }) => new ManagerPassword(value))
    public password: ManagerPassword;
}
