import {IsNotEmpty, IsString} from "class-validator";
import {CompanyId} from "@domain/company/company";
import {Transform} from "class-transformer";

export class GetSummaryRequest {
    @IsNotEmpty()
    @IsString({ message: 'Company Id  must be a string' })
    @Transform(({ value }) => new CompanyId(value))
    readonly companyId: CompanyId;
}
