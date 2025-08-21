import { Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    GetEmployeeRolesQuery
} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.query";
import {
    GetEmployeeRolesUseCase
} from "@application/use-cases/default/employee/queries/get-roles/get-employee-roles.usecase";
import {RoleProxy} from "@application/use-case-proxies/role/role.proxy";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ROLE.BASE)
export class RoleController {
    constructor(
        @Inject(RoleProxy.GET_EMPLOYEE_ROLES)
        private readonly getEmployeeRoles: UseCaseProxy<GetEmployeeRolesUseCase>,
    ) {}

    @Get(DEFAULT_ROUTES.ROLE.ROLES)
    async getRoles(
        @RequestActor() actor
    ) {
        const query = GetEmployeeRolesQuery.of(actor);

        return this.getEmployeeRoles.getInstance().execute(query);

    }
}
