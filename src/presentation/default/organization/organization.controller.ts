import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {
    GetUserPermittedOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-user/get-list-by-user.usecase";
import {BaseQuery} from "@application/common/base-query";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";
import {OrganizationResponseDto} from "@presentation/dtos/organization.response";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {GetOrganizationListQueryDto} from "@presentation/default/organization/dto/get-list-organizations.request";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ORGANIZATION.BASE)
export class OrganizationController {
    constructor(
        @Inject(OrganizationProxy.GET_LIST)
        private readonly getListUseCaseProxy: UseCaseProxy<GetOrganizationListUseCase>,
        @Inject(OrganizationProxy.GET_USER_PERMITTED_ORGANIZATIONS_LIST)
        private readonly getUserPermittedOrganizationListUseCaseProxy: UseCaseProxy<GetUserPermittedOrganizationListUseCase>
    ) {}


    @Get(DEFAULT_ROUTES.ORGANIZATION.GET_LIST)
    async getListByCompany(
        @RequestQuery() dto: GetOrganizationListQueryDto,
        @RequestActor() actor
    ) {
        const query = GetOrganizationListQuery.of(dto, actor);

        const {list, meta} = await this.getListUseCaseProxy.getInstance().execute(query);

        return {
            list: list.map(OrganizationResponseDto.fromDomain),
            meta
        };
    }


    @Get(DEFAULT_ROUTES.ORGANIZATION.USER_PERMITTED_GET_LIST)
    async getUserPermittedList(
        @RequestActor() actor: any
    ) {
        const query = new BaseQuery(actor);

        const result = await this.getUserPermittedOrganizationListUseCaseProxy.getInstance().execute(query);

        return result.map(OrganizationResponseDto.fromDomain);
    }

}
