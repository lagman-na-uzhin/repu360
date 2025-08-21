import {Transform, Type} from "class-transformer";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {RoleId} from "@domain/policy/model/role";

export class CreateEmployeeRequestDto {
    @Transform(({ value }) => EmployeeEmail.of(value))
    email: EmployeeEmail;

    @Transform(({ value }) => EmployeeName.of(value))
    name: EmployeeName;

    @Transform(({ value }) => EmployeePhone.of(value))
    phone: EmployeePhone;

    @Transform(({ value }) => RoleId.of(value))
    roleId: RoleId;
}
