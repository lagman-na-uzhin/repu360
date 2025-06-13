import { Expose, plainToInstance } from 'class-transformer';
import {Organization} from "@domain/organization/organization";

export class OrganizationResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    companyId: string;

    public static fromDomain(organization: Organization): OrganizationResponseDto {
        const plainObject = organization.toPlainObject();
        return plainToInstance(OrganizationResponseDto, plainObject, {
            excludeExtraneousValues: true,
        });
    }
}
