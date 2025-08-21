import { BaseCommand } from "@application/common/base-command";
import { EmployeeEmail } from "@domain/employee/value-object/employee-email.vo";
import { EmployeeName } from "@domain/employee/value-object/employee-name.vo";
import { EmployeePhone } from "@domain/employee/value-object/employee-phone.vo";
import { RoleId } from "@domain/policy/model/role";
import { Actor } from "@domain/policy/actor";
import { CompanyId } from "@domain/company/company";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";

export interface IEmployeePermissionPayload {
    module: string;
    permission?: string;
    organizationId?: string;
    fullAccess?: boolean;
}

 type IEmployeeRoleOption = {
    roleId: RoleId;
    role?: undefined;
} | {
    roleId?: undefined;
    role: {
        name: string;
        permissions: IEmployeePermissionPayload[];
    };
};

 type ICreateEmployeePayload = {
    email: EmployeeEmail;
    name: EmployeeName;
    phone: EmployeePhone;
} & IEmployeeRoleOption;


export class CreateEmployeeCommand extends BaseCommand {
    private constructor(
        readonly companyId: CompanyId,
        readonly email: EmployeeEmail,
        readonly name: EmployeeName,
        readonly phone: EmployeePhone,
        actor: Actor,
        readonly roleId?: RoleId,
        readonly role?: {
            name: string;
            permissions: IEmployeePermissionPayload[];
        }
    ) {
        super(actor);
    }

    static of(payload: ICreateEmployeePayload, actor: Actor): CreateEmployeeCommand {
        if (!actor?.companyId) {
            throw new Error(EXCEPTION.COMPANY.NOT_FOUND);
        }

        if (payload.role && payload.roleId) {
            throw new Error('You cannot provide both a roleId and new role data.');
        }

        if (!payload.role && !payload.roleId) {
            throw new Error('Either roleId or new role data must be provided.');
        }

        if (payload.role) {
            payload.role.permissions.forEach((perm) => {
                if (!perm.permission && !perm.fullAccess) {
                    throw new Error(`Permission is missing for module: ${perm.module}`);
                }

                const requiresOrgId = ['REVIEWS', 'ORGANIZATIONS'].includes(perm.module as string);
                if (requiresOrgId && !perm.organizationId) {
                    throw new Error(`organizationId is required for module: ${perm.module}`);
                }
            });
        }

        return new CreateEmployeeCommand(
            actor.companyId,
            payload.email,
            payload.name,
            payload.phone,
            actor,
            payload.roleId,
            payload.role
        );
    }
}
