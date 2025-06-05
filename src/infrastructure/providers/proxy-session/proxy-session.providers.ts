import {ProxyService} from "@infrastructure/services/request/proxy.service";
import {TwogisClient} from "@infrastructure/integrations/twogis/twogis.client";
import {RequestService} from "@infrastructure/services/request/request.service";
import {TwogisSession} from "@infrastructure/integrations/twogis/twogis.session";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";




export const ProxySessionProxy = {
    "TWOGIS_SESSION": 'TWOGIS_SESSION_PROXY',
} as const;

export const proxySessionProviders = [
    {
        provide: ProxySessionProxy.TWOGIS_SESSION,
        useFactory: async (
            proxyService: ProxyService,
            twogisClient: TwogisClient,
            requestService: RequestService
        ): Promise<ITwogisSession> => {
            const session = new TwogisSession(proxyService, twogisClient, requestService);
            await session.init();
            return session;
        },
        inject: [ProxyService, TwogisClient, RequestService],
    }

]
export const proxySessionProxyExports = [
    ProxySessionProxy.TWOGIS_SESSION,
]
