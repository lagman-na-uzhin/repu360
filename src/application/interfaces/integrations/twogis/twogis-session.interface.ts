import {CompanyId} from "@domain/company/company";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";
import {
    IReviewFromCabinet
} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";
import {ISendReply} from "@application/interfaces/integrations/twogis/client/dto/out/send-reply-response.out.dto";
import {PlacementId} from "@domain/placement/placement";
import {
    GetOrganizationReviewsInDto
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {Review} from "@domain/review/review";
import {
    ILoginTwogisCabinetResponse
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";
import {OrgByIdOutDto} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {
    ISearchedRubricsResult
} from "@application/interfaces/integrations/twogis/client/dto/out/searched-rubrics.out.dto";
import {OrganizationId} from "@domain/organization/organization";

export interface ITwogisSession {
    init(companyId?: CompanyId, cabinetCredentials?: TwogisCabinetCredentials): Promise<void>;
    getByIdOrganization(externalId: string): Promise<OrgByIdOutDto>
    getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials): Promise<ILoginTwogisCabinetResponse>;
    generateReply(accessToken: string, authorName: string): Promise<IGenerateReply>;
    getReviewFromCabinet(reviewExternalId: string, accessToken: string): Promise<IReviewFromCabinet>;
    sendOfficialReply(accessToken: string, text: string, reviewExternalId: string): Promise<ISendReply>;
    getOrganizationReviews(
        placementId: PlacementId,
        externalId: string,
        payload: GetOrganizationReviewsInDto,
    ): Promise<Review[] | null>;
    searchRubrics(accessToken: string, query: string): Promise<ISearchedRubricsResult>
    addRubrics(rubricIds: string[], organizationId: OrganizationId, accessToken: string): Promise<void>;
    deleteRubrics(rubricIds: string[], organizationId: OrganizationId, accessToken: string): Promise<void>;

}
