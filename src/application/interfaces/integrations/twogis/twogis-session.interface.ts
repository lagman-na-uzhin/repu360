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
import {Profile} from "@domain/review/model/profile/profile";
import {
    ILoginTwogisCabinetResponse
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";

export interface ITwogisSession {
    init(companyId?: CompanyId): Promise<void>;
    getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials): Promise<ILoginTwogisCabinetResponse>;
    generateReply(accessToken: string, authorName: string): Promise<IGenerateReply>;
    getReviewFromCabinet(reviewExternalId: string, accessToken: string): Promise<IReviewFromCabinet>;
    sendOfficialReply(accessToken: string, text: string, reviewExternalId: string): Promise<ISendReply>;
    getOrganizationReviews(
        placementId: PlacementId,
        externalId: string,
        payload: GetOrganizationReviewsInDto,
    ): Promise<Review[] | null>;

}
