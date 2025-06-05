import {
    GetOrganizationReviewsInDto
} from "@application/interfaces/integrations/twogis/client/dto/in/get-organization-reviews.in.dto";
import {
    IOrganizationReviewsOutDto
} from "@application/interfaces/integrations/twogis/client/dto/out/organization-reviews.out.dto";
import {Organization} from "@domain/organization/organization";
import {Placement} from "@domain/placement/placement";
import {
    IReviewFromCabinet
} from "@application/interfaces/integrations/twogis/client/dto/out/review-from-cabinet.out.dto";
import {ISendReply} from "@application/interfaces/integrations/twogis/client/dto/out/send-reply-response.out.dto";
import {IProxyService} from "@application/interfaces/services/proxy/proxy-service.interface";
import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";

export interface ITwogisClient {
    getCabinetAccessToken(placement: Placement): Promise<string>
    getReviewFromCabinet(externalId: string, accessToken: string, proxy: IProxy): Promise<IReviewFromCabinet>
    sendOfficialReply(accessToken: string, reviewExternalId: string, text: string, proxy: IProxy): Promise<ISendReply>
    generateReply(accessToken: string, authorName: string, proxy: IProxy): Promise<IGenerateReply>
    loginCabinet(login: string, password: string, proxy: IProxy)
}
