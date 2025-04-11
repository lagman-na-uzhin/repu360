import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";

export class LoginInput {
    constructor(
        public readonly email: EmployeeEmail,
        public readonly password: EmployeePassword
    ) {}

    static of(email: string, password: string) {
        return new LoginInput(new EmployeeEmail(email), new EmployeePassword(password))
    }
}
