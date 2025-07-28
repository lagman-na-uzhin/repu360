import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const EmployeeProxy = {
    "GET_LIST_EMPLOYEE_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}GetListEmployeeUseCaseProxy`,
} as const;

export const employeeProxyExports = [
    EmployeeProxy.GET_LIST_EMPLOYEE_USE_CASE,
]
