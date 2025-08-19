import {Body, Controller, Get, Inject, Injectable, Post, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GetEmployeeListUseCase} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.usecase";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.query";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetEmployeeListQueryDto} from "@presentation/default/employee/dto/get-employee-list-query.request";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";
import {PaginatedResultDto} from "@presentation/dtos/paginated-response";
import {ReviewResponseDto} from "@presentation/dtos/review.response";
import {EmployeeResponseDto} from "@presentation/dtos/employee.response";
import {GetEmployeeRolesUseCase} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.usecase";
import {GetEmployeeRolesQuery} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.query";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {
    CreateEmployeeRoleCommand
} from "@application/use-cases/default/role/commands/create-employee-role/create-employee-role.command";


@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.EMPLOYEE.BASE)
export class EmployeeController {
    constructor(
        @Inject(EmployeeProxy.GET_LIST_EMPLOYEE_USE_CASE)
        private readonly getListProxy: UseCaseProxy<GetEmployeeListUseCase>,
    ) {}

    @Get(DEFAULT_ROUTES.EMPLOYEE.LIST)
    async getList(
        @RequestQuery() dto: GetEmployeeListQueryDto,
        @RequestActor() actor
    ) {
        const query = GetListEmployeeQuery.of(dto, actor);

        return this.getListProxy.getInstance().execute(query);

    }
}
