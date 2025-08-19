import {Body, Controller, Get, Inject, Post, Query, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetReviewListQueryDto} from "@presentation/default/review/dto/get-list-review.request";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {GetReviewListUseCase} from "@application/use-cases/default/review/get-list/get-list-review.usecase";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";
import {
    GetEmployeeRolesQuery
} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.query";
import {
    CreateEmployeeRoleCommand
} from "@application/use-cases/default/role/commands/create-employee-role/create-employee-role.command";
import {EmployeeProxy} from "@application/use-case-proxies/employee/employee.proxy";
import {
    GetEmployeeRolesUseCase
} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.usecase";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ROLE.BASE)
export class RoleController {
    constructor(
        @Inject(EmployeeProxy.GET_EMPLOYEE_ROLES)
        private readonly getEmployeeRoles: UseCaseProxy<GetEmployeeRolesUseCase>
    ) {}



    @Get(DEFAULT_ROUTES.ROLE.EMPLOYEE_ROLES)
    async getRoles(
        @RequestActor() actor
    ) {
        const query = GetEmployeeRolesQuery.of(actor);

        return this.getEmployeeRoles.getInstance().execute(query);

    }

    @Post(DEFAULT_ROUTES.ROLE.CREATE_EMPLOYEE_ROLE)
    async createEmployeeRole(
        @Body() dto: any, //TODO
        @RequestActor() actor
    ) {
        const cmd = CreateEmployeeRoleCommand.of(dto, actor);

    }
}
