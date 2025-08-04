import {IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {GetOrganizationListByCompanyFilter} from "@domain/organization/repositories/params/get-list-by-company.params";

class GetOrganizationListFilterDto implements GetOrganizationListByCompanyFilter {
    @IsNotEmpty({ message: 'Company Id is required' })
    @IsString({ message: 'Company Id must be a string' })
    @Transform(({ value }) => new CompanyId(value))
    readonly companyId: CompanyId;


    @IsOptional()
    readonly isActive?: boolean;

    @IsOptional()
    readonly isTemporarilyClosed?: boolean
}


export class GetOrganizationListQueryDto implements GetListParams {
    @ValidateNested()
    @Type(() => GetOrganizationListFilterDto)
    readonly filter: GetOrganizationListFilterDto;

    @ValidateNested()
    @Type(() => PaginationParamsDto)
    readonly pagination: PaginationParamsDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => SortParamsDto)
    readonly sort?: SortParamsDto;

    @IsOptional()
    @IsString({ message: 'Search query must be a string' })
    readonly search?: string;
}
