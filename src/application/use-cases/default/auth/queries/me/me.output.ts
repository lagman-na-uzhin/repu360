import { EmployeeName } from "@domain/employee/value-object/employee-name.vo";
import { CompanyId } from "@domain/company/company";
import { EmployeePhone } from "@domain/employee/value-object/employee-phone.vo";
import { EmployeeEmail } from "@domain/employee/value-object/employee-email.vo";
import { Role } from "@domain/policy/model/role";
import { UniqueID } from "@domain/common/unique-id";
import { ManagerName } from "@domain/manager/value-object/manager-name.vo";
import { ManagerPhone } from "@domain/manager/value-object/manager-phone.vo";
import { ManagerEmail } from "@domain/manager/value-object/manager-email.vo";

export class UserMeOutput {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly role: {
            id: string;
            name: string | null;
            type: string;
            permissions: {
                companies: string[];
            };
        },
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
        email: EmployeeEmail | ManagerEmail
    ): UserMeOutput {
        const permissions =
            role.isAdmin() || role.isManager()
                ? Array.from(role.managerPermissions.companies)
                : Array.from(role.employeePermissions.companies);

        return new UserMeOutput(
            id.toString(),
            name.toString(),
            {
                id: role.id.toString(),
                name: role.name ? role.name.toString() : null,
                type: role.type.toString(),
                permissions: {
                    companies: permissions,
                },
            },
            companyId ? companyId.toString() : null,
            phone.toString(),
            email.toString()
        );
    }
}
