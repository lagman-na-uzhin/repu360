import {IsString, IsInt, Min, Max, IsBoolean} from 'class-validator';
import {Transform} from 'class-transformer';
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";

export class PaginationParamsDto implements PaginationParams {
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    @Transform(({ value }) => Number(value))
    readonly page: number;

    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    @Transform(({ value }) => Number(value))
    readonly limit: number;
}

export class SortParamsDto implements SortParams {
    @IsString({ message: 'Sort field must be a string' })
    readonly sortBy: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    readonly isSortDesc: boolean;
}
