import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {CompanyId} from "@domain/company/company";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Role} from "@domain/policy/model/role";
import {UniqueID} from "@domain/common/unique-id";
import {ManagerName} from "@domain/manager/value-object/manager-name.vo";
import {ManagerPhone} from "@domain/manager/value-object/manager-phone.vo";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";

class PermissionOutput {
    constructor(
        public readonly companies: string[]
    ) {
    }
}
class RoleOutput {
    constructor(
        public readonly id: string,
        public readonly name: string | null,
        public readonly type: string,
        public readonly permissions: PermissionOutput
    ) {
    }
}
export class UserMeOutput {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly role: RoleOutput,
        public readonly companyId: string | null,
        public readonly phone: string,
        public readonly email: string
    ) {}

    static of(
        id: UniqueID,
        name: EmployeeName | ManagerName,
        role: Role,
        companyId: CompanyId | null,
        phone: EmployeePhone | ManagerPhone,
        email: EmployeeEmail | ManagerEmail,
    ) {
        let permissionsOutput: PermissionOutput;
        if (role.isAdmin() || role.isManager()) {
            permissionsOutput = new PermissionOutput(
                Array.from(role.managerPermissions.companies)
            )
        } else {
            permissionsOutput = new PermissionOutput(
                Array.from(role.employeePermissions.companies)
            )
        }

        const roleOutput = new RoleOutput(
            role.id.toString(),
            role.name ? role.name.toString() : null,
            role.type.toString(),
            permissionsOutput
        )
        return new UserMeOutput(
            id.toString(),
            name.toString(),
            roleOutput,
            companyId ? companyId.toString() : companyId,
            phone.toString(),
            email.toString(),

        )
    }
}
