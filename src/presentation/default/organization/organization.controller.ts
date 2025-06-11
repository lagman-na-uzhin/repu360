import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetListByCompanyDto} from "@presentation/default/organization/dto/get-list-by-company.dto";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {Actor} from "@domain/policy/actor";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {
    GetUserPermittedOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-user/get-list-by-user.usecase";
import {BaseQuery} from "@application/common/base-query";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ORGANIZATION.BASE)
export class OrganizationController {
    constructor(
        @Inject(OrganizationProxy.GET_LIST)
        private readonly getListUseCaseProxy: UseCaseProxy<GetOrganizationListUseCase>,
        @Inject(OrganizationProxy.GET_USER_PERMITTED_ORGANIZATIONS_LIST)
        private readonly getUserPermittedOrganizationListUseCaseProxy: UseCaseProxy<GetUserPermittedOrganizationListUseCase>
    ) {}


    @Get(DEFAULT_ROUTES.ORGANIZATION.GET_LIST_BY_COMPANY)
    async getListByCompany(
        @RequestQuery() dto: GetListByCompanyDto,
        @RequestActor() actor: Actor
    ) {
        const query = GetOrganizationListQuery.of(dto, actor);

        return this.getListUseCaseProxy.getInstance().execute(query);
    }


    @Get(DEFAULT_ROUTES.ORGANIZATION.USER_PERMITTED_GET_LIST)
    async getUserPermittedList(
        @RequestActor() actor: Actor
    ) {
        const query = new BaseQuery(actor);
        return this.getUserPermittedOrganizationListUseCaseProxy.getInstance().execute(query);
    }

}
