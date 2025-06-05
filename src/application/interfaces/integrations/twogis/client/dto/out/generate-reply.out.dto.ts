import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

export interface IGenerateReplyResult {
    comment: string
}

export interface IGenerateReply extends IBaseTwogisResponse {
    result: IGenerateReplyResult;
}
