import {IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {GetReviewListFilterParams} from "@domain/review/repositories/params/get-list.params";
import {PlacementId} from "@domain/placement/placement";


class GetReviewListFilterDto implements GetReviewListFilterParams {
    @IsNotEmpty({ message: 'Placement Id is required' })
    @IsString({ message: 'Placement Id must be a string' })
    @Transform(({ value }) => new PlacementId(value))
    readonly placementId: PlacementId;

    @IsOptional()
    @Transform(({ value }) => value ? new CompanyId(value) : null)
    readonly groupId: CompanyId | null;

    @IsOptional()
    @Transform(({ value }) => value ? new OrganizationId(value) : null)
    readonly organizationId: OrganizationId | null;

    @IsOptional()
    @IsEnum(['positive', 'negative'], { message: 'Tone must be positive, negative, or not provided' })
    readonly tone: 'positive' | 'negative' | null;


    @IsOptional()
    @IsEnum(PLATFORMS, { message: 'Platform must be a valid PLATFORMS value' })
    readonly platform: PLATFORMS | null;
}


export class GetReviewListQueryDto implements GetListParams {
    @ValidateNested()
    @Type(() => GetReviewListFilterDto)
    readonly filter: GetReviewListFilterDto;

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
