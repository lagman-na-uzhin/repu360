import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetListByCompanyDto} from "@presentation/default/organization/dto/get-list-by-company.dto";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {Actor} from "@domain/policy/actor";
import {OrganizationProxy} from "@infrastructure/providers/organization/organization.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ORGANIZATION.BASE)
export class OrganizationController {
    constructor(
        @Inject(OrganizationProxy.GET_LIST)
        private readonly getListUseCaseProxy: UseCaseProxy<GetOrganizationListUseCase>
    ) {}


    @Get(DEFAULT_ROUTES.ORGANIZATION.GET_LIST_BY_COMPANY)
    async getListByCompany(
        @RequestQuery() dto: GetListByCompanyDto,
        @RequestActor() actor: Actor
    ) {
        const query = GetOrganizationListQuery.of(dto, actor);

        return this.getListUseCaseProxy.getInstance().execute(query);
    }

}
