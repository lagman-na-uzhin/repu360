import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const RoleProxy = {
    "GET_EMPLOYEE_ROLES": `${ProxyPrefix.EMPLOYEE_PROXY}GetEmployeeRolesUseCaseProxy`,
    "CREATE_EMPLOYEE_ROLE": `${ProxyPrefix.ROLE_PROXY}CreateEmployeeRoleUseCase`,
} as const;

export const roleProxyExports = [
    RoleProxy.CREATE_EMPLOYEE_ROLE,
    RoleProxy.GET_EMPLOYEE_ROLES
]
