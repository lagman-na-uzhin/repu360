import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

export interface ISearchedRubricsResult {
    total: number;
    items: {id: string, name: string, keyword: string}[]
}
export interface SearchedRubricsOutDto extends IBaseTwogisResponse {
    result: ISearchedRubricsResult

}
