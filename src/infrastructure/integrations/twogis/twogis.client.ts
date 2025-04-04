import {ITwogisClient} from "src/application/integrations/twogis/client/twogis-client.interface";
import {IProxy} from "src/application/repositories/proxy/proxy-repository.interface";
import {
    GetOrganizationReviewsInDto
} from "src/application/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {IProxyService} from "src/application/services/proxy/proxy-service.interface";
import {
    GET_ORGANIZATION_REVIEWS_CONFIG,
    GET_ORGANIZATION_REVIEWS_NEXT_CONFIG
} from "src/infrastructure/integrations/twogis/twogis.client.const";
import {
    IOrganizationReviewsOutDto
} from "src/application/integrations/twogis/client/dto/out/organization-reviews.out.dto";

export class TwogisClient implements ITwogisClient {
    constructor(
        private readonly proxyService: IProxyService,
        private readonly requestService: any, //TODO
    ) {}

    async getOrganizationReviews(
        organizationExternalId: string,
        payload: GetOrganizationReviewsInDto,
    ): Promise<IOrganizationReviewsOutDto | null> {
        const proxy = await this.proxyService.getNextReviewSyncProxy("twogis_sync_reviews");

        let reviewList = await this.fetchReviews(organizationExternalId, payload, proxy);
        if (!reviewList) return reviewList;

        let nextReviewsUrl: string | undefined = reviewList.meta?.url;

        while (nextReviewsUrl) {
            await this.sleep(2000);

            const nextReviewList = await this.fetchReviews(nextReviewsUrl, payload, proxy, true);
            if (nextReviewList?.reviews?.length) {
                reviewList.reviews.push(...nextReviewList.reviews);
            }

            nextReviewsUrl = nextReviewList?.meta?.url;
        }

        return reviewList;
    }

    private async fetchReviews(
        source: string,
        payload: GetOrganizationReviewsInDto,
        proxy: IProxy,
        isNextPage = false
    ): Promise<IOrganizationReviewsOutDto | null> {
        let retries = 7;
        let reviewList: IOrganizationReviewsOutDto;

        do {
            reviewList = isNextPage
                ? await this.requestService.request(GET_ORGANIZATION_REVIEWS_NEXT_CONFIG(source), proxy)
                : await this.requestService.request(GET_ORGANIZATION_REVIEWS_CONFIG(source, { type: payload.type, limit: 50 }), proxy);

            if (reviewList.reviews.length || reviewList.meta.branch_rating !== undefined) {
                return reviewList;
            }

            await this.sleep(1000);
            retries--;
        } while (retries > 0);

        return null;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
