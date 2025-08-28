import {Transform} from "class-transformer";
import {OrganizationId} from "@domain/organization/organization";
import {IsString} from "class-validator";

export class TwogisSearchRubricsRequest {
    @IsString()
     text: string;

    @Transform(({ value }) => OrganizationId.of(value))
     organizationId: OrganizationId;
}
