import { Expose, plainToInstance } from 'class-transformer';

export class RoleResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    type: string;

    // public static fromDomain(role: Role): RoleResponseDto {
    //     const plainObject = role.toPlainObject();
        // return plainToInstance(RoleResponseDto, plainObject, {
        //     excludeExtraneousValues: true,
        // });
    // }
}
