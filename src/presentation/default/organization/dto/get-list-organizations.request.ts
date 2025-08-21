import { IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";

class GetOrganizationListFilterDto {
    @Transform(({ value }) => CompanyId.of(value))
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
