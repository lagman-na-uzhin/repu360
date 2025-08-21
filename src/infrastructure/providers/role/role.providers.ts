import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {RoleProxy} from "@application/use-case-proxies/role/role.proxy";
import {EmployeeQueryService} from "@infrastructure/query-services/employee-query.service";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {
    GetEmployeeRolesUseCase
} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.usecase";

export const roleProxyProviders = [
    {
        inject: [EmployeeQueryService],
        provide: RoleProxy.GET_EMPLOYEE_ROLES,
        useFactory: (employeeQueryService: IEmployeeQs) => {
            return new UseCaseProxy(new GetEmployeeRolesUseCase(employeeQueryService))
        }
    },
]
