import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/get-list/get-employee-list.usecase";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {EmployeeOrmRepository} from "@infrastructure/repositories/employee/employee.repository";

export const employeeProxyProviders = [
    {
        inject: [EmployeeOrmRepository],
        provide: ReviewProxy.TWOGIS_SYNC_REVIEWS_PROCESS_USE_CASE,
        useFactory: (employeeRepo: IEmployeeRepository) => {
            return new UseCaseProxy(new GetEmployeeListUseCase(employeeRepo))
        }
    },
]
