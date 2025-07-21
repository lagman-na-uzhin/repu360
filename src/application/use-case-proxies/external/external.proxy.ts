import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const ExternalProxy = {
    "GOOGLE_SEARCH_PLACES": `${ProxyPrefix.EXTERNAL_PROXY}SearchGooglePlacesUseCaseProxy`,
} as const;

export const externalProxyExports = [
    ExternalProxy.GOOGLE_SEARCH_PLACES,
]
