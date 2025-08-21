import {CompanyId} from "@domain/company/company";
import {Transform} from "class-transformer";

export class GetSummaryRequest {
    @Transform(({ value }) => CompanyId.of(value))
    readonly companyId: CompanyId;
}
