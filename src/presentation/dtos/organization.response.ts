import { Expose, plainToInstance } from 'class-transformer';
import {Organization} from "@domain/organization/organization";

export class OrganizationAddressResponseDto {
    @Expose()
    region: string;

    @Expose()
    district: string;

    @Expose()
    street: string;

    @Expose()
    buildingNumber: string;

    @Expose()
    apartmentNumber: string;

    @Expose()
    zipCode: string;
}
export class OrganizationResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    companyId: string;

    @Expose()
    address: OrganizationAddressResponseDto

    public static fromDomain(organization: Organization): OrganizationResponseDto {
        const plainObject = organization.toPlainObject();
        return plainToInstance(OrganizationResponseDto, plainObject, {
            excludeExtraneousValues: true,
        });
    }
}
