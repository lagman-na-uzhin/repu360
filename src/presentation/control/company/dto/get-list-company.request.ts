import {IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {ManagerId} from "@domain/manager/manager";
import {GetListParams} from "@domain/common/repositories/get-list.interface";
import {GetCompanyListFilterParams} from "@domain/company/repositories/types/get-company-list.params";

class GetCompanyListFilterDto implements GetCompanyListFilterParams {
    @IsOptional()
    @IsString({ message: 'Manager Id must be a string' })
    @Transform(({ value }) => value ? new ManagerId(value) : undefined)
    readonly managerId?: ManagerId;
}


export class GetCompanyListQueryDto implements GetListParams {
    @ValidateNested()
    @Type(() => GetCompanyListFilterDto)
    readonly filter: GetCompanyListFilterDto;

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
