import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const ExternalProxy = {
    "GOOGLE_SEARCH_PLACES": `${ProxyPrefix.EXTERNAL_PROXY}SearchGooglePlacesUseCaseProxy`,
    "TWOGIS_SEARCH_RUBRICS": `${ProxyPrefix.EXTERNAL_PROXY}SearchGoogleRubricsUseCaseProxy`
} as const;

export const externalProxyExports = [
    ExternalProxy.GOOGLE_SEARCH_PLACES,
    ExternalProxy.TWOGIS_SEARCH_RUBRICS
]
