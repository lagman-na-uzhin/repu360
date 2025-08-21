import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.usecase";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {EmployeeQueryService} from "@infrastructure/query-services/employee-query.service";
import {GetEmployeeRolesUseCase} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.usecase";
import {CreateEmployeeUseCase} from "@application/use-cases/default/employee/commands/create-employee.usecase";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {ITaskService} from "@application/interfaces/services/task/task-service.interface";
import {EmployeeOrmRepository} from "@infrastructure/repositories/employee/employee.repository";
import {BcryptService} from "@infrastructure/services/hash/bcrypt.service";
import {BullService} from "@infrastructure/services/bull/bull.service";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {IMailerRepository} from "@application/interfaces/services/mailer/mailer-repository.interface";
import {MailerOrmRepository} from "@infrastructure/repositories/mailer/mailer.repository";

export const employeeProxyProviders = [
    {
        inject: [EmployeeQueryService],
        provide: EmployeeProxy.GET_LIST_EMPLOYEE,
        useFactory: (employeeQueryService: IEmployeeQs) => {
            return new UseCaseProxy(new GetEmployeeListUseCase(employeeQueryService))
        }
    },
    {
        inject: [EmployeeOrmRepository, RoleOrmRepository, BcryptService, BullService, MailerOrmRepository],
        provide: EmployeeProxy.CREATE_EMPLOYEE,
        useFactory: (
            employeeRepo: IEmployeeRepository,
            roleRepo: IRoleRepository,
            hashService: IHashService,
            taskService: ITaskService,
            mailerRepo: IMailerRepository
        ) => {
            return new UseCaseProxy(
                new CreateEmployeeUseCase(
                    employeeRepo,
                    roleRepo,
                    hashService,
                    taskService,
                    mailerRepo
                ))
        }
    },
]
