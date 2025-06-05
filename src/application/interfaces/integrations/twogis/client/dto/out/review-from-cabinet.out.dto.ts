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

export interface IReviewResultCabinet {
    id: string;
    rating: string;
    hasCompanyComment: boolean;
    firstAnswer: IFirstAnswer;
}

export interface IReviewFromCabinet extends IBaseTwogisResponse {
    result: IReviewResultCabinet;
}
