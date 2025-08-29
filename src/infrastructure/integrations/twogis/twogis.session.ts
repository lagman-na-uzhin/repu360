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
import {OrganizationId} from "@domain/organization/organization";
import {
    OrgByIdBusinessOutDto
} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id-business.out.dto";

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
//     private repositories: ITwogisRepository;
//
//     async init(): Promise<void> {
//         this.proxy = await this.getProxy(this.companyId)
//     }
//
//     async loginCabinet(credentials: TwogisCabinetCredentials) {
//         return this.repositories.loginCabinet(credentials, this.proxy);
//     }
//
//     async generateReply(accessToken: string, authorName: string) {
//         return this.repositories.generateReply(accessToken, authorName, this.proxy);
//     }
//
//     async getOrganizationReviews(
//         placementId: PlacementId,
//         externalId: string,
//         payload: GetOrganizationReviewsInDto,
//     ) {
//         return this.repositories.getOrganizationReviews(placementId, externalId, payload);
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
    private cabinetAccessToken: string | null = null;

    constructor(
        private readonly proxyService: ProxyService,
        private readonly requestService: RequestService,
        private readonly cacheRepo: CacheRepository
    ) {}

    async init(companyId?: CompanyId, cabinetCredentials?: TwogisCabinetCredentials): Promise<void> {
        this.proxy = await this.getProxy(companyId);
        this.repo = new TwogisRepository(this.proxyService, this.requestService);

        if (cabinetCredentials) {
            const loginResponse = await this.getCabinetAccessToken(cabinetCredentials); //TODO caching
            this.cabinetAccessToken = loginResponse.result.access_token;
            console.log(this.cabinetAccessToken, "this.cabinetAccessToken")
        }
    }

    async getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials): Promise<ILoginTwogisCabinetResponse> {
        return this.repo.getCabinetAccessToken(cabinetCredentials, this.proxy);
    }

    async generateReply(authorName: string): Promise<IGenerateReply> {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')
        return this.repo.generateReply(this.cabinetAccessToken, authorName, this.proxy);
    }
    async getReviewFromCabinet(reviewExternalId: string): Promise<IReviewFromCabinet> {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')
        return this.repo.getReviewFromCabinet(reviewExternalId, this.cabinetAccessToken, this.proxy);
    }

    async sendOfficialReply(text: string, reviewExternalId: string) {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')
        return this.repo.sendOfficialReply(this.cabinetAccessToken, text, reviewExternalId, this.proxy);
    }

    async searchRubrics(query: string): Promise<ISearchedRubricsResult> {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')
        const res = await this.repo.searchRubrics(query, this.cabinetAccessToken, this.proxy)
        console.log(res, "ress session")
        return res.meta.code == 200 ? res.result : {total: 0, items: []};
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

    async getByIdOrganizationFromBusiness(externalId: string): Promise<OrgByIdBusinessOutDto> {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')
        return this.repo.getByIdOrganizationFromBusiness(externalId, this.cabinetAccessToken, this.proxy)
    }

    async addRubrics(rubricIds: string[], externalId: string): Promise<void> {
        const data = {
            rubrics: rubricIds.map(id =>{ return  {action: "add", id: id} })
        }
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')

        await this.repo.updateRubrics(data, externalId, this.cabinetAccessToken, this.proxy);
    }

    async deleteRubrics(rubricIds: string[], externalId: string): Promise<void> {
        const data = {
            rubrics: rubricIds.map(id =>{ return  {action: "delete", id: id} })
        }
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')

        await this.repo.updateRubrics(data, externalId, this.cabinetAccessToken, this.proxy);
    }

    async updateWorkingHours(externalId: string, days: {
        [p: string]: { from: string; to: string; breaks?: { from: string; to: string }[] }
    }) {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')

        await this.repo.updateWorkingHours(externalId, this.cabinetAccessToken, this.proxy, days);
    }

    async getOrganizationGeometryHover(orgExternalId: string): Promise<{ lat: number; lon: number }> {
        if (!this.cabinetAccessToken) throw new Error('Business Access Token Not Provided')

        return this.repo.getOrganizationGeometryHover(orgExternalId, this.cabinetAccessToken, this.proxy);
    }


    private async getProxy(companyId?: CompanyId) {
        let proxy: IProxy | null;
        if (companyId) {
            proxy = await this.proxyService.getCompanyIndividualProxy(companyId);
        } else {
            proxy = await this.proxyService.getSharedProxy();
        }

        if (!proxy) throw new Error(`Proxy not found: Company ID: ${companyId?.toString()}`)

        await this.cacheRepo.setProxyCooldown(proxy.id);

        return proxy;

    }
}
