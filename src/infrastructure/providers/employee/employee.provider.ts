import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/get-list/get-employee-list.usecase";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {EmployeeQueryService} from "@infrastructure/query-services/employee/employee-query.service";

export const employeeProxyProviders = [
    {
        inject: [EmployeeQueryService],
        provide: EmployeeProxy.GET_LIST_EMPLOYEE_USE_CASE,
        useFactory: (employeeQueryService: IEmployeeQs) => {
            return new UseCaseProxy(new GetEmployeeListUseCase(employeeQueryService))
        }
    },
]
