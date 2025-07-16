import {IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaginationParamsDto, SortParamsDto} from "@presentation/dtos/get-list.request";
import {GetListParams} from "@domain/common/repositories/get-list.interface";
import {CompanyId} from "@domain/company/company";
import {GetOrganizationListByCompanyFilter} from "@domain/organization/repositories/params/get-list-by-company.params";
import {PLATFORMS} from "@domain/common/platfoms.enum";

class PlacementRequestDto {
    @IsNotEmpty({ message: 'externalId Id is required' })
    @IsString({ message: 'externalId Id must be a string' })
    public readonly externalId: string;

    @IsEnum(PLATFORMS)
    public readonly platform: PLATFORMS;

    @IsNotEmpty({ message: 'addressName Id is required' })
    @IsString({ message: 'Company Id must be a string' })
    public readonly addressName: string;

    @IsNotEmpty({ message: 'type Id is required' })
    @IsString({ message: 'type must be a string' })
    public readonly type: string;
}

export class AddOrganizationRequestDto {
    @IsNotEmpty({ message: 'Company Id is required' })
    @IsString({ message: 'Company Id must be a string' })
    @Transform(({ value }) => new CompanyId(value))
    readonly companyId: CompanyId;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    readonly address: string;

    @IsArray({ message: 'placements must be a array' })
    readonly placements: PlacementRequestDto[];
}
