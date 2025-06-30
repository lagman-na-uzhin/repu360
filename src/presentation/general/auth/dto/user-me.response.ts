import { Expose, plainToInstance } from 'class-transformer';
import {Manager} from "@domain/manager/manager";
import {Employee} from "@domain/employee/employee";
import {Role} from "@domain/policy/model/role";

class UserRoleResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    type: string;

    @Expose()
    permissions: Object;
}
export class UserMeResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    role: UserRoleResponseDto;


    @Expose()
    email: string;

    @Expose()
    companyId: string | null;

    @Expose()
    avatar?: string;


    public static fromDomain(domain: Manager | Employee, domainRole: Role): UserMeResponseDto {
        const userRoleDto = plainToInstance(UserRoleResponseDto, {
            id: domainRole.id.toString(), // Convert UniqueID to string
            name: domainRole.name, // Convert ValueObject to string
            type: domainRole.type.toString(), // Convert ValueObject to string
            permissions: domainRole.employeePermissions.toPlainObject() || domainRole.managerPermissions.toPlainObject() , // Use the determined companyId
        }, {
            excludeExtraneousValues: true,
        });

        let companyId: string | null = null;
        if (domain instanceof Employee) {
            companyId = domain.companyId.toString(); // Call .toString() on CompanyId VO
        }

        return plainToInstance(UserMeResponseDto, {
            id: domain.id.toString(), // Convert UniqueID to string
            name: domain.name.toString(), // Convert ValueObject to string
            email: domain.email.toString(), // Convert ValueObject to string
            companyId, // Use the determined companyId
            role: userRoleDto,
        }, {
            excludeExtraneousValues: true,
        });
    }

}
