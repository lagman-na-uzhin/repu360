import {EmployeePermissions} from "@domain/employee/model/employee-permissions";
import {EmployeeId} from "@domain/employee/employee";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {EmployeeRole} from "@domain/employee/model/employee-role";
import {CompanyId} from "@domain/company/company";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";

class Role {
    constructor(
        public readonly id: string,
        public readonly name: string | null,
        public readonly type: string,
        public readonly permissions: EmployeePermissions,
    ) {}
}
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
        role: EmployeeRole,
        companyId: CompanyId,
        phone: EmployeePhone,
        email: EmployeeEmail,
    ) {
        return new EmployeeMeOutput(
            id.toString(),
            name.toString(),
            new Role(role.id.toString(), role.name?.toString() || null, role.type.toString(), role.permissions),
            companyId.toString(),
            phone.toString(),
            email.toString(),

        )
    }
}
