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

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ORGANIZATION.BASE)
export class OrganizationController {
    constructor(
        @Inject(OrganizationProxy.GET_LIST)
        private readonly getListUseCaseProxy: UseCaseProxy<GetOrganizationListUseCase>,
        @Inject(OrganizationProxy.GET_USER_PERMITTED_ORGANIZATIONS_LIST)
        private readonly getUserPermittedOrganizationListUseCaseProxy: UseCaseProxy<GetUserPermittedOrganizationListUseCase>
    ) {}


    // @Get(ORGANIZATION_API_ROUTES.GET_LIST_BY_COMPANY.path(':companyId'))
    // async getListByCompany(
    //     @RequestParams('companyId') companyId: typeof ORGANIZATION_API_ROUTES.GET_LIST_BY_COMPANY._pathParams['companyId'],
    //     @RequestQuery() query: typeof ORGANIZATION_API_ROUTES.GET_LIST_BY_COMPANY._queryParams,
    //     @RequestActor() actor: Actor
    // ) {
    //     // const query = GetOrganizationListQuery.of(companyId, query, actor);
    //     //
    //     // return this.getListUseCaseProxy.getInstance().execute(query);
    // }


    @Get(DEFAULT_ROUTES.ORGANIZATION.USER_PERMITTED_GET_LIST)
    async getUserPermittedList(
        @RequestActor() actor: any
    ) {
        const query = new BaseQuery(actor);

        const result = await this.getUserPermittedOrganizationListUseCaseProxy.getInstance().execute(query);

        return result.map(OrganizationResponseDto.fromDomain);
    }

}
