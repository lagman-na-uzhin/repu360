import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const EmployeeProxy = {
    "GET_LIST_EMPLOYEE_USE_CASE": `${ProxyPrefix.EMPLOYEE_PROXY}GetListEmployeeUseCaseProxy`,
    "GET_EMPLOYEE_ROLES": `${ProxyPrefix.EMPLOYEE_PROXY}GetEmployeeRolesUseCaseProxy`,
} as const;

export const employeeProxyExports = [
    EmployeeProxy.GET_LIST_EMPLOYEE_USE_CASE,
    EmployeeProxy.GET_EMPLOYEE_ROLES
]
