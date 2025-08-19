import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    CreateEmployeeRoleUseCase
} from "@application/use-cases/default/role/commands/create-employee-role/create-employee-role.usecase";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {RoleProxy} from "@application/use-case-proxies/role/role.proxy";

export const roleProxyProviders = [
    {
        inject: [RoleOrmRepository],
        provide: RoleProxy.CREATE_EMPLOYEE_ROLE,
        useFactory: (roleRepo: IRoleRepository) => {
            return new UseCaseProxy(new CreateEmployeeRoleUseCase(roleRepo))
        }
    },
]
