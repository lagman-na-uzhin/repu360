import { Expose, plainToInstance } from 'class-transformer';
import {Manager} from "@domain/manager/manager";
import {Employee} from "@domain/employee/employee";

export class EmployeeResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    phone: string;

    @Expose()
    avatar: string;

    @Expose()
    roleId: string;

    @Expose()
    companyId: string;

    public static fromDomain(employee: Employee): EmployeeResponseDto {
        const plainObject = employee.toPlainObject();
        return plainToInstance(EmployeeResponseDto, plainObject, {
            excludeExtraneousValues: true,
        });
    }
}
