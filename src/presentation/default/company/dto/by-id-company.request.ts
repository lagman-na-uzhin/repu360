import {IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {CompanyId} from "@domain/company/company";

export class ByIdCompanyParamsRequestDto {
    @IsNotEmpty({ message: 'Company Id is required' })
    @IsString({ message: 'Company Id must be a string' })
    @Transform(({ value }) => new CompanyId(value))
    readonly companyId: CompanyId;
}
