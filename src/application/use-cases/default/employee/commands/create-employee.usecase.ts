import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {ITaskService, QUEUE_TYPE, QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {Role, RoleId} from "@domain/policy/model/role";
import {RoleType} from "@domain/policy/types/role-type.enum";
import {
    DEFAULT_PERMISSIONS_MODULE,
    DefaultPermissions,
    GLOBAL_ORGANIZATION_KEY
} from "@domain/policy/model/default-permissions";
import {DefaultCompanyPermission} from "@domain/policy/model/default/default-company-permission.enum";
import {DefaultEmployeePermission} from "@domain/policy/model/default/default-employee-permission.enum";
import {DefaultOrganizationPermission} from "@domain/policy/model/default/default-organization-permission.enum";
import {DefaultReviewPermission} from "@domain/policy/model/default/default-review-permission.enum";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {
    CreateEmployeeCommand,
    IEmployeePermissionPayload
} from "@application/use-cases/default/employee/commands/create-employee.command";
import {IMail, MAIL_TEMPLATE_TYPE} from "@application/interfaces/services/mailer/mailer-service.interface";
import {UniqueID} from "@domain/common/unique-id";
import {IMailerRepository} from "@application/interfaces/services/mailer/mailer-repository.interface";

type PermissionPayloads = {
    companiesPermissions: DefaultCompanyPermission[];
    employeesPermissions: DefaultEmployeePermission[];
    reviewPermissionsMap: Map<string, DefaultReviewPermission[]>;
    organizationPermissionsMap: Map<string, DefaultOrganizationPermission[]>;
};

export class CreateEmployeeUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly roleRepo: IRoleRepository,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService,
        private readonly mailerRepo: IMailerRepository
    ) {}

    async execute(cmd: CreateEmployeeCommand): Promise<void> {
        // if (!EmployeePolicy.canCreateEmployee(cmd.actor)) {
        //     throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);
        // }

        const roleId: RoleId = cmd.roleId
            ? cmd.roleId
            : await this.createAndSaveNewRole(cmd.role!);

        const { originalPassword, hashedPassword } = await this.generateEmployeePassword();

        const employee = Employee.create(
            cmd.companyId,
            roleId,
            cmd.name,
            cmd.email,
            cmd.phone,
            hashedPassword
        );

        console.log(employee, "employee")
        await this.employeeRepo.save(employee);
        await this.initSendPasswordTask(employee.id, employee.email, originalPassword);
    }

    private async createAndSaveNewRole(rolePayload: { name: string; permissions: IEmployeePermissionPayload[] }): Promise<RoleId> {
        const { companiesPermissions, employeesPermissions, reviewPermissionsMap, organizationPermissionsMap } = this.extractPermissions(rolePayload.permissions);

        const permissions = DefaultPermissions.fromPersistence(
            companiesPermissions,
            employeesPermissions,
            reviewPermissionsMap,
            organizationPermissionsMap
        );

        const role = Role.create(RoleType.EMPLOYEE, permissions, rolePayload.name);
        await this.roleRepo.save(role);

        console.log(role, "role")
        return role.id;
    }

    private extractPermissions(permissionsPayload: IEmployeePermissionPayload[]): PermissionPayloads {
        const result: PermissionPayloads = {
            companiesPermissions: [],
            employeesPermissions: [],
            reviewPermissionsMap: new Map(),
            organizationPermissionsMap: new Map(),
        };

        permissionsPayload.forEach(p => {
            switch (p.module) {
                case DEFAULT_PERMISSIONS_MODULE.COMPANIES:
                    if (p.fullAccess) {
                        result.companiesPermissions.push(...Object.values(DefaultCompanyPermission));
                    } else if (p.permission) {
                        result.companiesPermissions.push(p.permission as DefaultCompanyPermission);
                    }
                    break;
                case DEFAULT_PERMISSIONS_MODULE.EMPLOYEE:
                    if (p.fullAccess) {
                        result.employeesPermissions.push(...Object.values(DefaultEmployeePermission));
                    } else if (p.permission) {
                        result.employeesPermissions.push(p.permission as DefaultEmployeePermission);
                    }
                    break;
                case DEFAULT_PERMISSIONS_MODULE.ORGANIZATION:
                    if (p.fullAccess) {
                        result.organizationPermissionsMap.set(GLOBAL_ORGANIZATION_KEY, Object.values(DefaultOrganizationPermission));
                    } else if (p.organizationId && p.permission) {
                        const orgId = p.organizationId.toString();
                        if (!result.organizationPermissionsMap.has(orgId)) {
                            result.organizationPermissionsMap.set(orgId, []);
                        }
                        result.organizationPermissionsMap.get(orgId)!.push(p.permission as DefaultOrganizationPermission);
                    }
                    break;
                case DEFAULT_PERMISSIONS_MODULE.REVIEW:
                    if (p.fullAccess) {
                        result.reviewPermissionsMap.set(GLOBAL_ORGANIZATION_KEY, Object.values(DefaultReviewPermission));
                    } else if (p.organizationId && p.permission) {
                        const orgId = p.organizationId.toString();
                        if (!result.reviewPermissionsMap.has(orgId)) {
                            result.reviewPermissionsMap.set(orgId, []);
                        }
                        result.reviewPermissionsMap.get(orgId)!.push(p.permission as DefaultReviewPermission);
                    }
                    break;
            }
        });
        return result;
    }

    private async generateEmployeePassword(): Promise<{ hashedPassword: EmployeePassword; originalPassword: string }> {
        const min = 10000000;
        const max = 99999999;
        const generatedStringPassword = `${Math.floor(Math.random() * (max - min + 1)) + min}`;
        const hashedPasswordString = await this.hashService.hash(generatedStringPassword);

        return {
            hashedPassword: new EmployeePassword(hashedPasswordString),
            originalPassword: generatedStringPassword
        };
    }

    private async initSendPasswordTask(employeeId: EmployeeId, employeeEmail: EmployeeEmail, originalPassword: string) {
        const { id } = await this.createAndSaveMail(employeeId, employeeEmail, originalPassword);
        await this.taskService.addTask({
            queue: QUEUES.SEND_MAIL_QUEUE,
            jobId: `send_email_${employeeEmail.toString()}`,
            attempts: 5,
            delay: 0,
            type: QUEUE_TYPE.DELAY,
            payload: {id},
        });
    }

    private async createAndSaveMail(
        employeeId: EmployeeId,
        employeeEmail: EmployeeEmail,
        originalPassword: string
    ): Promise<{id: string}> {
        const mail = {
            id: new UniqueID().toString(),
            template: MAIL_TEMPLATE_TYPE.EMPLOYEE_CREATED_PASSWORD,
            userId: employeeId.toString(),
            email: employeeEmail.toString(),
            payload: {password: originalPassword}
        } as IMail;
        return await this.mailerRepo.save(mail);
    }
}
