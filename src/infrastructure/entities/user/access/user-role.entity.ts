import {PrimaryGeneratedColumn, Column, Entity, OneToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {USER_TYPE} from "@domain/employee/model/employee-role";
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {UserEntity} from "@infrastructure/entities/user/user.entity";

@Entity('user_role')
export class UserRoleEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @OneToOne(() => UserEntity)
    user: UserEntity;

    @OneToMany(() => UserPermissionEntity, (permission) => permission.role, { eager: true })
    permissions: UserPermissionEntity[];
}
