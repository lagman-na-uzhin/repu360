import {Controller, Get, Inject, Query} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ExternalProxy} from "@application/use-case-proxies/external/external.proxy";
import {
    SearchGooglePlacesUseCase
} from "@application/use-cases/default/external/search-google-places/search-google-places.usecase";
import {GoogleSearchPlacesRequest} from "@presentation/default/external/dto/google-search-places.request";
import {FastifyReply} from 'fastify';
import {mybusinessaccountmanagement} from "@googleapis/mybusinessaccountmanagement";
import {
    SearchGoogleRubricsUseCase
} from "@application/use-cases/default/external/search-twogis-rubrics/search-google-rubrics.usecase";
import {TwogisSearchRubricsRequest} from "@presentation/default/external/dto/twogis-search-rubrics.request";
import {OrganizationId} from "@domain/organization/organization";

@Controller(DEFAULT_ROUTES.EXTERNAL.BASE)
export class ExternalController {
    constructor(
        @Inject(ExternalProxy.GOOGLE_SEARCH_PLACES)
        private readonly externalGoogleSearchPlaces: UseCaseProxy<SearchGooglePlacesUseCase>,
        @Inject(ExternalProxy.TWOGIS_SEARCH_RUBRICS)
        private readonly externalTwogisSearchRubrics: UseCaseProxy<SearchGoogleRubricsUseCase>
) {}

    @Get(DEFAULT_ROUTES.EXTERNAL.GOOGLE_PLACES_SEARCH)
    async googlePlacesSearch(
        @Query() dto: GoogleSearchPlacesRequest,
        @RequestActor() actor
    ) {
        console.log("googlePlacesSearch", dto);
        return this.externalGoogleSearchPlaces.getInstance().execute(dto.text);
    }

    @Get(DEFAULT_ROUTES.EXTERNAL.TWOGIS_SEARCH_RUBRICS)
    async twogisRubricsSearch(
        @Query() dto: TwogisSearchRubricsRequest,
        @RequestActor() actor
    ) {
        return this.externalTwogisSearchRubrics.getInstance().execute({text: dto.text, organizationId: dto.organizationId}); //TODO mock
    }

}
