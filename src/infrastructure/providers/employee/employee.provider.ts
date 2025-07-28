import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/get-list/get-employee-list.usecase";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {EmployeeOrmRepository} from "@infrastructure/repositories/employee/employee.repository";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";

export const employeeProxyProviders = [
    {
        inject: [EmployeeOrmRepository],
        provide: EmployeeProxy.GET_LIST_EMPLOYEE_USE_CASE,
        useFactory: (employeeRepo: IEmployeeRepository) => {
            return new UseCaseProxy(new GetEmployeeListUseCase(employeeRepo))
        }
    },
]
