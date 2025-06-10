import {
    GetOrganizationReviewsInDto,
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import { Profile } from '@domain/review/profile';
import { Review } from '@domain/review/review';
import {PlacementId} from '@domain/placement/placement';
import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {
    IReviewFromCabinet
} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";
import {ISendReply} from "@application/interfaces/integrations/twogis/client/dto/out/send-reply-response.out.dto";
import {
    ILoginTwogisCabinetResponse
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";

export interface ITwogisRepository {
    getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials, proxy: IProxy): Promise<ILoginTwogisCabinetResponse>
    generateReply(accessToken: string, authorName: string, proxy: IProxy): Promise<IGenerateReply>
    getOrganizationReviews(
        placementId: PlacementId,
        externalId: string,
        payload: GetOrganizationReviewsInDto,
        proxy: IProxy
    ): Promise<{ review: Review; profile: Profile }[] | null>;
    generateReply(accessToken: string, authorName: string, proxy: IProxy): Promise<IGenerateReply>;
    getReviewFromCabinet(accessToken: string, reviewExternalId: string, proxy: IProxy): Promise<IReviewFromCabinet>;
    sendOfficialReply(accessToken: string, text: string, reviewExternalId: string, proxy: IProxy): Promise<ISendReply>;

}
