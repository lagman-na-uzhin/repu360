import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
    FilterParams,
    GetListParams,
    PaginationParams,
    SortParams
} from "@domain/common/interfaces/repositories/get-list.interface";

export class FilterDto implements FilterParams {}

class Sort implements SortParams {
    @IsString()
    readonly sortBy: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly isSortDesc: boolean;
}

export class PaginationDto implements PaginationParams {
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    readonly page: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    readonly limit: number;
}

export class GetListDto implements GetListParams {
    @IsString()
    @IsOptional()
    readonly search?: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => FilterDto)
    readonly filter?: FilterDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PaginationDto)
    readonly pagination: PaginationDto;

    @IsObject()
    @ValidateNested()
    @IsOptional()
    @Type(() => Sort)
    readonly sort?: Sort;
}

