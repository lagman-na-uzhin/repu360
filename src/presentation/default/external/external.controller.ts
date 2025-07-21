import {Controller, Get, Inject, Post, UseGuards} from '@nestjs/common';
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
import {PaginatedResultDto} from "@presentation/dtos/paginated-response";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {
    AddOrganizationUseCase
} from "@application/use-cases/default/organization/commands/add/add-organization.usecase";
import {
    AddOrganizationCommand
} from "@application/use-cases/default/organization/commands/add/add-organization.command";
import {AddOrganizationRequestDto} from "@presentation/default/organization/dto/add-organization.request";
import {ExternalProxy} from "@application/use-case-proxies/external/external.proxy";
import {
    SearchGooglePlacesUseCase
} from "@application/use-cases/default/external/search-google-places/search-google-places.usecase";
import {GoogleSearchPlacesRequest} from "@presentation/default/external/dto/google-search-places.request";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.EXTERNAL.BASE)
export class ExternalController {
    constructor(
        @Inject(ExternalProxy.GOOGLE_SEARCH_PLACES)
        private readonly externalGoogleSearchPlaces: UseCaseProxy<SearchGooglePlacesUseCase>
    ) {}

    @Get(DEFAULT_ROUTES.EXTERNAL.GOOGLE_PLACES_SEARCH)
    async googlePlacesSearch(
        @RequestQuery() dto: GoogleSearchPlacesRequest,
        @RequestActor() actor
    ) {
        console.log("googlePlacesSearch", dto)
        return this.externalGoogleSearchPlaces.getInstance().execute(dto.text);
    }


    @Get(DEFAULT_ROUTES.ORGANIZATION.GET_LIST)
    async getListByCompany(
        @RequestQuery() dto: GetOrganizationListQueryDto,
        @RequestActor() actor
    ) {
    }


    @Get(DEFAULT_ROUTES.ORGANIZATION.USER_PERMITTED_GET_LIST)
    async getUserPermittedList(
        @RequestActor() actor
    ) {
    }

}
