import {Body, Controller, Get, Inject, Post, Query, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.usecase";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.query";
import {GetEmployeeListQueryDto} from "@presentation/default/employee/dto/get-employee-list-query.request";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {CreateEmployeeRequestDto} from "@presentation/default/employee/dto/create-employee.request";
import {CreateEmployeeCommand} from "@application/use-cases/default/employee/commands/create-employee.command";
import {CreateEmployeeUseCase} from "@application/use-cases/default/employee/commands/create-employee.usecase";


@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.EMPLOYEE.BASE)
export class EmployeeController {
    constructor(
        @Inject(EmployeeProxy.GET_LIST_EMPLOYEE)
        private readonly getListProxy: UseCaseProxy<GetEmployeeListUseCase>,
        @Inject(EmployeeProxy.CREATE_EMPLOYEE)
        private readonly createEmployee: UseCaseProxy<CreateEmployeeUseCase>,
    ) {}

    @Get(DEFAULT_ROUTES.EMPLOYEE.LIST)
    async getList(
        @Query() dto: GetEmployeeListQueryDto,
        @RequestActor() actor
    ) {
        const query = GetListEmployeeQuery.of(dto, actor);

        return this.getListProxy.getInstance().execute(query);

    }


    @Post(DEFAULT_ROUTES.EMPLOYEE.CREATE)
    async create(
        @Body() dto: CreateEmployeeRequestDto,
        @RequestActor() actor
    ) {
        const command = CreateEmployeeCommand.of(dto, actor);

        return this.createEmployee.getInstance().execute(command);

    }
}
