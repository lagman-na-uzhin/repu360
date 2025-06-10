import {ProxyService} from "@infrastructure/services/request/proxy.service";
import {RequestService} from "@infrastructure/services/request/request.service";
import {TwogisSession} from "@infrastructure/integrations/twogis/twogis.session";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {CacheRepository} from "@infrastructure/repositories/cache/cache.repository";

export const ProxySessionProxy = {
    "TWOGIS_SESSION": 'TWOGIS_SESSION_PROXY',
} as const;

export const proxySessionProviders = [
    {
        provide: ProxySessionProxy.TWOGIS_SESSION,
        useFactory: async (
            proxyService: ProxyService,
            requestService: RequestService,
            cacheRepo: CacheRepository
        ): Promise<ITwogisSession> => {
            const session = new TwogisSession(proxyService, requestService, cacheRepo);
            // await session.init();
            return session;
        },
        inject: [ProxyService, RequestService, CacheRepository],
    }

]
export const proxySessionProxyExports = [
    ProxySessionProxy.TWOGIS_SESSION,
]
