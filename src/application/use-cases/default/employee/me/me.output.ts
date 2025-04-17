import {EmployeeId} from "@domain/employee/employee";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {CompanyId} from "@domain/company/company";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Role} from "@domain/policy/model/role";

export class EmployeeMeOutput {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly role: Role,
        public readonly companyId: string,
        public readonly phone: string,
        public readonly email: string
    ) {}

    static of(
        id: EmployeeId,
        name: EmployeeName,
        role: Role,
        companyId: CompanyId,
        phone: EmployeePhone,
        email: EmployeeEmail,
    ) {
        return new EmployeeMeOutput(
            id.toString(),
            name.toString(),
            role,
            companyId.toString(),
            phone.toString(),
            email.toString(),

        )
    }
}
