import {PrimaryGeneratedColumn, Column, Entity, OneToMany} from 'typeorm';
import {USER_TYPE} from "@domain/company/model/employee/employee-role";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";

@Entity('user_role')
export class UserRoleEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    name: string;

    @Column()
    type: USER_TYPE;

    @OneToMany(() => UserPermissionEntity, (permission) => permission.role, { eager: true })
    permissions: UserPermissionEntity[];
}
