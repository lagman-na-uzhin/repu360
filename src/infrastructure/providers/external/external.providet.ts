import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GoogleRepository} from "@infrastructure/integrations/google/google.repository";
import {ExternalProxy} from "@application/use-case-proxies/external/external.proxy";
import {IGoogleRepository} from "@application/interfaces/integrations/google/google.repository.interface";
import {
    SearchGooglePlacesUseCase
} from "@application/use-cases/default/external/search-google-places/search-google-places.usecase";
import {
    SearchGoogleRubricsUseCase
} from "@application/use-cases/default/external/search-twogis-rubrics/search-google-rubrics.usecase";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {ProxySessionProxy} from "@infrastructure/providers/proxy-session/proxy-session.providers";

export const externalProxyProviders = [
    {
        inject: [GoogleRepository],
        provide: ExternalProxy.GOOGLE_SEARCH_PLACES,
        useFactory: (
            googleRepo: IGoogleRepository,
        ) => {
            return new UseCaseProxy(new SearchGooglePlacesUseCase(googleRepo))
        }
    },
    {
        inject: [ProxySessionProxy.TWOGIS_SESSION, PlacementOrmRepository],
        provide: ExternalProxy.TWOGIS_SEARCH_RUBRICS,
        useFactory: (
            twogisSession: ITwogisSession,
            placementRepo: IPlacementRepository
        ) => {
            return new UseCaseProxy(new SearchGoogleRubricsUseCase(twogisSession, placementRepo))
        }
    },
]
