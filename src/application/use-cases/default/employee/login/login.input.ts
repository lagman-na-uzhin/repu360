import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";

export class EmployeeLoginCommand {
    constructor(
        public readonly email: EmployeeEmail,
        public readonly password: EmployeePassword
    ) {}

    static of( dto: {email: EmployeeEmail, password: EmployeePassword}) {
        return new EmployeeLoginCommand(dto.email, dto.password);
    }
}
