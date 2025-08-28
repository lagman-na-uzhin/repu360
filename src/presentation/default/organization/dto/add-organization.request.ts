import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {CompanyId} from "@domain/company/company";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {GroupId} from "@domain/organization/group";

export class AddOrganizationRequestDto {
    @Transform(({ value }) => CompanyId.of(value))
    readonly companyId: CompanyId;

    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    readonly city: string;

    @Transform(({ value }) =>{value ? GroupId.of(value) : null})
    readonly groupId: GroupId | null;

    @IsNotEmpty({ message: 'External ID is required' })
    @IsString({ message: 'External ID must be a string' })
    readonly externalId: string;

    @IsEnum(PLATFORMS)
    public readonly platform: PLATFORMS;

    public readonly login: string;
    public readonly password: string;

}
