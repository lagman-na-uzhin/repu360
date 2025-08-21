import {Transform} from "class-transformer";
import {CompanyId} from "@domain/company/company";

export class ByIdCompanyParamsRequestDto {
    @Transform(({ value }) => CompanyId.of(value))
    readonly companyId: CompanyId;
}
