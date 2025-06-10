import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

export interface ILoginTwogisCabinetResult {
    access_token: string;
    expires_in: string;
    refresh_token: string;
    token_type: "Bearer";
}

export interface ILoginTwogisCabinetResponse extends IBaseTwogisResponse {
    result: ILoginTwogisCabinetResult;
}
