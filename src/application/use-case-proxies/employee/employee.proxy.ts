import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const EmployeeProxy = {
    "GET_LIST_EMPLOYEE": `${ProxyPrefix.EMPLOYEE_PROXY}GetListEmployeeUseCaseProxy`,
    "CREATE_EMPLOYEE": `${ProxyPrefix.EMPLOYEE_PROXY}CreateEmployeeUseCaseProxy`
} as const;

export const employeeProxyExports = [
    EmployeeProxy.GET_LIST_EMPLOYEE,
    EmployeeProxy.CREATE_EMPLOYEE
]
