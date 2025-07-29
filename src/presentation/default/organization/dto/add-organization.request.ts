import {IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {GetOrganizationListByCompanyFilter} from "@domain/organization/repositories/params/get-list-by-company.params";
import {PLATFORMS} from "@domain/common/platfoms.enum";

export class AddOrganizationRequestDto {
    @IsNotEmpty({ message: 'Company Id is required' })
    @IsString({ message: 'Company Id must be a string' })
    @Transform(({ value }) => new CompanyId(value))
    readonly companyId: CompanyId;

    @IsNotEmpty({ message: 'External ID is required' })
    @IsString({ message: 'External ID must be a string' })
    readonly externalId: string;

    @IsEnum(PLATFORMS)
    public readonly platform: PLATFORMS;

}
