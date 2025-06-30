import { Expose, plainToInstance } from 'class-transformer';
import {Manager} from "@domain/manager/manager";

export class ManagerResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    phone: string;

    @Expose()
    roleId: string;

    public static fromDomain(manager: Manager): ManagerResponseDto {
        const plainObject = manager.toPlaintObject();
        return plainToInstance(ManagerResponseDto, plainObject, {
            excludeExtraneousValues: true,
        });
    }
}
