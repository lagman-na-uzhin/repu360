import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {GoogleRepository} from "@infrastructure/integrations/google/google.repository";
import {ExternalProxy} from "@application/use-case-proxies/external/external.proxy";
import {IGoogleRepository} from "@application/interfaces/integrations/google/google.repository.interface";
import {
    SearchGooglePlacesUseCase
} from "@application/use-cases/default/external/search-google-places/search-google-places.usecase";

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
    ]
