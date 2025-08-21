import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const RoleProxy = {
    "GET_EMPLOYEE_ROLES": `${ProxyPrefix.EMPLOYEE_PROXY}GetEmployeeRolesUseCaseProxy`,
} as const;

export const roleProxyExports = [
    RoleProxy.GET_EMPLOYEE_ROLES
]
