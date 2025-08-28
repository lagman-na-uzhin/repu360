import {
    GetOrganizationReviewsInDto,
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import { Review } from '@domain/review/review';
import {PlacementId} from '@domain/placement/placement';
import {IProxy} from "@application/interfaces/services/proxy/proxy-repository.interface";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {
    IReviewFromCabinet
} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";
import {ISendReply} from "@application/interfaces/integrations/twogis/client/dto/out/send-reply-response.out.dto";
import {
    ILoginTwogisCabinetResponse
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";
import {OrgByIdOutDto} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {
    ISearchedRubricsResult, SearchedRubricsOutDto
} from "@application/interfaces/integrations/twogis/client/dto/out/searched-rubrics.out.dto";
import {
    OrgByIdBusinessOutDto
} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id-business.out.dto";
import {
    OrgGeometryHoverOutDto
} from "@application/interfaces/integrations/twogis/client/dto/out/org-geometry-hover.out.dto";

export interface ITwogisRepository {
    getByIdOrganization(externalId: string, proxy: IProxy): Promise<OrgByIdOutDto>
    getByIdOrganizationFromBusiness(externalId: string, accessToken: string, proxy: IProxy): Promise<OrgByIdBusinessOutDto>
    getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials, proxy: IProxy): Promise<ILoginTwogisCabinetResponse>
    generateReply(accessToken: string, authorName: string, proxy: IProxy): Promise<IGenerateReply>
    getOrganizationReviews(
        placementId: PlacementId,
        externalId: string,
        payload: GetOrganizationReviewsInDto,
        proxy: IProxy
    ): Promise<Review[] | null>;
    generateReply(accessToken: string, authorName: string, proxy: IProxy): Promise<IGenerateReply>;
    getReviewFromCabinet(accessToken: string, reviewExternalId: string, proxy: IProxy): Promise<IReviewFromCabinet>;
    sendOfficialReply(accessToken: string, text: string, reviewExternalId: string, proxy: IProxy): Promise<ISendReply>;
    searchRubrics(query: string, accessToken: string,  proxy: IProxy): Promise<SearchedRubricsOutDto>;
    updateRubrics(data: {
        rubrics: {action: 'add', id: string}[]
    },
                  organizationId: string,
                  accessToken: string,
                  proxy: IProxy
    ): Promise<void>
    getOrganizationGeometryHover(orgExternalId: string, accessToken: string, proxy: IProxy): Promise<{ lat: number; lon: number }>
}
