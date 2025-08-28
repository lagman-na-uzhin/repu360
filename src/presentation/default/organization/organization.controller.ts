import {Body, Controller, Get, Inject, Param, Post, Put, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    GetOrganizationListUseCase
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.usecase";
import {BaseQuery} from "@application/common/base-query";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {
    GetOrganizationListQuery
} from "@application/use-cases/default/organization/queries/get-list-by-company/get-list-by-company.query";
import {GetOrganizationListQueryDto} from "@presentation/default/organization/dto/get-list-organizations.request";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {
    AddOrganizationUseCase
} from "@application/use-cases/default/organization/commands/add/add-organization.usecase";
import {
    AddOrganizationCommand
} from "@application/use-cases/default/organization/commands/add/add-organization.command";
import {AddOrganizationRequestDto} from "@presentation/default/organization/dto/add-organization.request";
import {
    GetCompactOrganizationQuery
} from "@application/use-cases/default/organization/queries/get-organization-compact/get-compact-organization.query";
import {
    GetCompactOrganizationsUseCase
} from "@application/use-cases/default/organization/queries/get-organization-compact/get-compact-organizations.usecase";
import {GetSummaryRequest} from "@presentation/default/organization/dto/get-summary.request";
import {GetSummaryQuery} from "@application/use-cases/default/organization/queries/get-summary/get-summary.query";
import {GetSummaryUseCase} from "@application/use-cases/default/organization/queries/get-summary/get-summary.usecase";
import {
    UpdateOrganizationUseCase
} from "@application/use-cases/default/organization/commands/update/update-organization.usecase";
import {
    UpdateOrganizationCommand
} from "@application/use-cases/default/organization/commands/update/update-organization.command";
import {
    UpdateOrganizationBodyRequestDto,
    UpdateOrganizationParamRequestDto
} from "@presentation/default/organization/dto/update-organization.request";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.ORGANIZATION.BASE)
export class OrganizationController {
    constructor(
        @Inject(OrganizationProxy.ADD)
        private readonly addOrganizationProxy: UseCaseProxy<AddOrganizationUseCase>,
        @Inject(OrganizationProxy.UPDATE)
        private readonly updateProxy: UseCaseProxy<UpdateOrganizationUseCase>,
        @Inject(OrganizationProxy.GET_LIST)
        private readonly getListProxy: UseCaseProxy<GetOrganizationListUseCase>,
        @Inject(OrganizationProxy.COMPACT_ORGANIZATIONS)
        private readonly getCompactOrganizationsProxy: UseCaseProxy<GetCompactOrganizationsUseCase>,
        @Inject(OrganizationProxy.GET_SUMMARY)
        private readonly getSummaryProxy: UseCaseProxy<GetSummaryUseCase>,
    ) {}

    @Post(DEFAULT_ROUTES.ORGANIZATION.ADD)
    async add(
        @RequestBody() dto: AddOrganizationRequestDto,
        @RequestActor() actor
    ) {
        const command = AddOrganizationCommand.of(dto, actor)
        return this.addOrganizationProxy.getInstance().execute(command);
    }

    @Put(DEFAULT_ROUTES.ORGANIZATION.UPDATE)
    async update(
        @Param() params: UpdateOrganizationParamRequestDto,
        @Body() dto: UpdateOrganizationBodyRequestDto,
        @RequestActor() actor
    ) {
        const command = UpdateOrganizationCommand.of({organizationId: params.organizationId, ...dto}, actor);

        return this.updateProxy.getInstance().execute(command);

    }

    @Get(DEFAULT_ROUTES.ORGANIZATION.GET_LIST)
    async getListByCompany(
        @RequestQuery() dto: GetOrganizationListQueryDto,
        @RequestActor() actor
    ) {
        const query = GetOrganizationListQuery.of(dto, actor);

        return this.getListProxy.getInstance().execute(query);

    }


    @Get(DEFAULT_ROUTES.ORGANIZATION.COMPACT_ORGANIZATIONS)
    async getCompactOrganizations(
        @RequestActor() actor
    ) {
        const query = GetCompactOrganizationQuery.of(actor);

        return this.getCompactOrganizationsProxy.getInstance().execute(query);

    }


    @Get(DEFAULT_ROUTES.ORGANIZATION.SUMMARY)
    async getOrganizationsSummary(
        @RequestQuery() dto: GetSummaryRequest,
        @RequestActor() actor
    ) {
        const query = GetSummaryQuery.of(dto, actor);

        return this.getSummaryProxy.getInstance().execute(query);

    }
}
