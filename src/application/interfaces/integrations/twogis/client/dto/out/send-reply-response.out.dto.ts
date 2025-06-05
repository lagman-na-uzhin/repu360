import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

interface IOrg {
    name: string;
}

export interface IFirstAnswer {
    id: string;
    text: string;
    org: IOrg;
    dateCreated: string;
}

export interface ISendReplyResultCabinet {
    id: string;
    type: "reply"
    text: string;
    org: IOrg;
    isOfficialAnswer: true

}

export interface ISendReply extends IBaseTwogisResponse {
    result: ISendReplyResultCabinet;
}
