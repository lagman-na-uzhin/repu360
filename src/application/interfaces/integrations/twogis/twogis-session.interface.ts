import {CompanyId} from "@domain/company/company";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {IGenerateReply} from "@application/interfaces/integrations/twogis/client/dto/out/generate-reply.out.dto";

export interface ITwogisSession {
    init(companyId: CompanyId): Promise<void>;
    getCabinetAccessToken(cabinetCredentials: TwogisCabinetCredentials): Promise<string>;
    generateReply(accessToken: string, authorName: string): Promise<IGenerateReply>;
    getReviewFromCabinet():

}
