import {IProxy} from "@application/interfaces/services/proxy/proxy-repository.interface";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {PlacementId} from "@domain/placement/placement";
import {
    GetOrganizationReviewsInDto
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {CompanyId} from "@domain/company/company";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {TwogisRepository} from "@infrastructure/integrations/twogis/twogis.repository";
import {ProxyService} from "@infrastructure/services/request/proxy.service";
import {RequestService} from "@infrastructure/services/request/request.service";
import {CacheRepository} from "@infrastructure/repositories/cache/cache.repository";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";
import {Review} from "@domain/review/review";
import {Profile} from "@domain/review/profile";
import {
    IReviewFromCabinet
} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";
import {
    ILoginTwogisCabinetResponse
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";
import {OrgByIdOutDto} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {extractBaseId} from "@infrastructure/integrations/twogis/twogis.utils";
import {
    ISearchedRubricsResult
} from "@application/interfaces/integrations/twogis/client/dto/out/searched-rubrics.out.dto";

// export class TwogisSession implements ITwogisSession{
//     private proxy: IProxy;
//
//     constructor(
//         private readonly proxyService: IProxyService,
//         private readonly twogisRepositoryFactory: (proxy: IProxy) => ITwogisRepository,
//         private readonly cacheRepo: ICacheRepository,
//         private readonly companyId?: CompanyId,
//     ) {}
//
//     private repository: ITwogisRepository;
//
//     async init(): Promise<void> {
//         this.proxy = await this.getProxy(this.companyId)
//     }
//
//     async loginCabinet(credentials: TwogisCabinetCredentials) {
//         return this.repository.loginCabinet(credentials, this.proxy);
//     }
//
//     async generateReply(accessToken: string, authorName: string) {
//         return this.repository.generateReply(accessToken, authorName, this.proxy);
//     }
//
//     async getOrganizationReviews(
//         placementId: PlacementId,
//         externalId: string,
//         payload: GetOrganizationReviewsInDto,
//     ) {
//         return this.repository.getOrganizationReviews(placementId, externalId, payload);
//     }
//
//     private async getProxy(companyId?: CompanyId) {
//         let proxy: IProxy;
//         if (companyId) {
//             proxy = await this.proxyService.getCompanyIndividualProxy(companyId);
//         } else {
//             proxy = await this.proxyService.getSharedProxy();
//         }
//
//         await this.cacheRepo.setProxyCooldown(proxy.id);
//
//         return proxy;
//
//     }
// }




export class TwogisSession implements ITwogisSession {
    private proxy: IProxy;
    private repo: TwogisRepository;

    constructor(
        private readonly proxyService: ProxyService,
        private readonly requestService: RequestService,
        private readonly cacheRepo: CacheRepository
    ) {}

    async init(companyId?: CompanyId): Promise<void> {
        console.log("init")
        this.proxy = await this.getProxy(companyId);
        console.log('proxy')
        this.repo = new TwogisRepository(this.proxyService, this.requestService);
    }

    async getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials): Promise<ILoginTwogisCabinetResponse> {
        return this.repo.getCabinetAccessToken(cabinetCredentials, this.proxy);
    }

    async generateReply(accessToken: string, authorName: string): Promise<IGenerateReply> {
        return this.repo.generateReply(accessToken, authorName, this.proxy);
    }
    async getReviewFromCabinet(reviewExternalId: string, accessToken: string): Promise<IReviewFromCabinet> {
        return this.repo.getReviewFromCabinet(reviewExternalId, accessToken, this.proxy);
    }

    async sendOfficialReply(accessToken: string, text: string, reviewExternalId: string) {
        return this.repo.sendOfficialReply(accessToken, text, reviewExternalId, this.proxy);
    }

    async searchRubrics(accessToken: string, query: string): Promise<ISearchedRubricsResult> {
        return this.repo.searchRubrics(accessToken, query, this.proxy);
    }

    async getOrganizationReviews(
        placementId: PlacementId,
        externalId: string,
        payload: GetOrganizationReviewsInDto,
    ): Promise<Review[] | null> {
        const baseId = extractBaseId(externalId);
        return this.repo.getOrganizationReviews(placementId, baseId, payload, this.proxy)
    }

    async getByIdOrganization(externalId: string): Promise<OrgByIdOutDto> {
        console.log(externalId, "sessionj")
        return this.repo.getByIdOrganization(externalId, this.proxy)
    }


    private async getProxy(companyId?: CompanyId) {
        let proxy: IProxy | null;
        console.log(companyId, "        console.log()\n")
        if (companyId) {
            console.log(this.proxyService, "proxy srvice")
            proxy = await this.proxyService.getCompanyIndividualProxy(companyId);
        } else {
            proxy = await this.proxyService.getSharedProxy();
        }

        if (!proxy) throw new Error(`Proxy not found: Company ID: ${companyId?.toString()}`)

        await this.cacheRepo.setProxyCooldown(proxy.id);

        return proxy;

    }
}
