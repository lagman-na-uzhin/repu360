import {IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {GetEmployeeListFilterParams} from "@domain/employee/repositories/params/get-employee-list.params";


class GetEmployeeListFilterDto implements GetEmployeeListFilterParams {
    @Transform(({ value }) => CompanyId.of(value))
    readonly companyId: CompanyId;
}


export class GetEmployeeListQueryDto implements GetListParams {
    @ValidateNested()
    @Type(() => GetEmployeeListFilterDto)
    readonly filter: GetEmployeeListFilterDto;

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
