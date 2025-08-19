import {IsArray, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {GroupId} from "@domain/organization/group";


class GetReviewListFilterDto  {
    @IsOptional()
    @IsArray({ message: 'groupIds must be an array' })
    @Transform(({ value }) => {
        if (value === '') {
            return null;
        }
        if (Array.isArray(value)) {
            const validIds = value.filter(i => i && typeof i === 'string' && i.trim() !== '');
            return validIds.length ? validIds.map(i => new GroupId(i)) : null;
        }
        return null;
    })
    readonly groupIds: GroupId[];

    @IsOptional()
    @IsArray({ message: 'organizationIds must be an array' })
    @Transform(({ value }) => {
        if (value === '') {
            return null;
        }
        if (Array.isArray(value)) {
            const validIds = value.filter(i => i && typeof i === 'string' && i.trim() !== '');
            return validIds.length ? validIds.map(i => new OrganizationId(i)) : null;
        }

        return null;
    })
    readonly organizationIds: OrganizationId[];

    @IsOptional()
    @IsArray({ message: 'cities must be an array' })
    readonly cities: string[];

    @IsOptional()
    readonly tone?: 'positive' | 'negative';

    @IsOptional()
    readonly platform?: PLATFORMS;
}


export class GetReviewListQueryDto implements GetListParams {
    @ValidateNested({ message: 'Filter parameters are invalid' })
    @Type(() => GetReviewListFilterDto)
    readonly filter: GetReviewListFilterDto;

    @ValidateNested({ message: 'Pagination parameters are invalid' })
    @Type(() => PaginationParamsDto)
    readonly pagination: PaginationParamsDto;

    @IsOptional()
    @ValidateNested({ message: 'Sort parameters are invalid' })
    @Type(() => SortParamsDto)
    readonly sort?: SortParamsDto;

    @IsOptional()
    @IsString({ message: 'Search query must be a string' })
    readonly search?: string;
}
