import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.usecase";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {EmployeeQueryService} from "@infrastructure/query-services/employee-query.service";
import {GetEmployeeRolesUseCase} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.usecase";

export const employeeProxyProviders = [
    {
        inject: [EmployeeQueryService],
        provide: EmployeeProxy.GET_LIST_EMPLOYEE_USE_CASE,
        useFactory: (employeeQueryService: IEmployeeQs) => {
            return new UseCaseProxy(new GetEmployeeListUseCase(employeeQueryService))
        }
    },

    {
        inject: [EmployeeQueryService],
        provide: EmployeeProxy.GET_EMPLOYEE_ROLES,
        useFactory: (employeeQueryService: IEmployeeQs) => {
            return new UseCaseProxy(new GetEmployeeRolesUseCase(employeeQueryService))
        }
    },
]
