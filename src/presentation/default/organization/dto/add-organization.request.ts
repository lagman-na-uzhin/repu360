import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {CompanyId} from "@domain/company/company";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {GroupId} from "@domain/organization/group";

export class AddOrganizationRequestDto {
    @IsNotEmpty({ message: 'Company Id is required' })
    @IsString({ message: 'Company Id must be a string' })
    @Transform(({ value }) => new CompanyId(value))
    readonly companyId: CompanyId;

    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    readonly city: string;

    @IsString({ message: 'Group Id must be a string' })
    @Transform(({ value }) =>{value ? new GroupId(value) : null})
    readonly groupId: GroupId | null;

    @IsNotEmpty({ message: 'External ID is required' })
    @IsString({ message: 'External ID must be a string' })
    readonly externalId: string;

    @IsEnum(PLATFORMS)
    public readonly platform: PLATFORMS;

}
