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
    IFilterDto,
    IGetListDto,
    IPaginationDto, ISort
} from "@domain/common/interfaces/repositories/get-list.interface";

export class FilterDto implements IFilterDto {}

class Sort implements ISort {
    @IsString()
    readonly sortBy: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly isSortDesc: boolean;
}

export class PaginationDto implements IPaginationDto{
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    readonly currentPage: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    readonly perPage: number;
}

export class GetListDto implements IGetListDto{
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

