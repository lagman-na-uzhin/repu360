import {
    CreateEmployeeRoleCommand
} from "@application/use-cases/default/role/commands/create-employee-role/create-employee-role.command";
import {Role} from "@domain/policy/model/role";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {EMPLOYEE_PERMISSIONS_MODULE, EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {EmployeeOrganizationPermission} from "@domain/policy/model/employee/employee-organization-permission.enum";
import {EmployeeReviewPermission} from "@domain/policy/model/employee/employee-review-permission.enum";
import {EmployeeCompanyPermission} from "@domain/policy/model/employee/employee-company-permission.enum";

export class CreateEmployeeRoleUseCase {
    constructor(
        private readonly roleRepo: IRoleRepository
    ) {}

    async execute(cmd: CreateEmployeeRoleCommand): Promise<void> {
        const permissions = this.createEmployeePermissions(cmd);
        const role = Role.create(RoleType.EMPLOYEE, permissions, cmd.name);

        await this.roleRepo.save(role);
    }

    private createEmployeePermissions(cmd: CreateEmployeeRoleCommand) {
        const companiesPermissions = cmd.permissions
            .filter(p => p.module === EMPLOYEE_PERMISSIONS_MODULE.COMPANIES)
            .map(e => e.permission as EmployeeCompanyPermission);

        const reviewPermissionsRecord = cmd.permissions
            .reduce((acc, p) => {
                if (p.module === EMPLOYEE_PERMISSIONS_MODULE.REVIEW) {
                    if (p.organizationId) {
                        if (!acc[p.organizationId.toString()]) {
                            acc[p.organizationId.toString()] = [];
                        }
                        acc[p.organizationId.toString()].push(p.permission as EmployeeReviewPermission);
                    }
                }
                return acc;
            }, {} as Record<string, EmployeeReviewPermission[]>);

        const organizationPermissionsRecord = cmd.permissions
            .reduce((acc, p) => {
                if (p.module === EMPLOYEE_PERMISSIONS_MODULE.ORGANIZATION) {
                    if (p.organizationId) {
                        if (!acc[p.organizationId.toString()]) {
                            acc[p.organizationId.toString()] = [];
                        }
                        acc[p.organizationId.toString()].push(p.permission as EmployeeOrganizationPermission);
                    }
                }
                return acc;
            }, {} as Record<string, EmployeeOrganizationPermission[]>);

        const reviewPermissionsMap = new Map(Object.entries(reviewPermissionsRecord));
        const organizationPermissionsMap = new Map(Object.entries(organizationPermissionsRecord));

        return EmployeePermissions.fromPersistence(
            companiesPermissions,
            reviewPermissionsMap,
            organizationPermissionsMap
        );
    }
}
