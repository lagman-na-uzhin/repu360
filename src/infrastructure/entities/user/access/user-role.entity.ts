import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, Unique} from 'typeorm';
import {UserPermissionEntity} from "@infrastructure/entities/user/access/user-permission.entity";
import {UserEntity} from "@infrastructure/entities/user/user.entity";

@Entity('user_role')
export class UserRoleEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column()
    public type: string;

    @OneToOne(() => UserEntity)
    user: UserEntity;

    @OneToMany(() => UserPermissionEntity, (permission) => permission.role, { eager: true })
    permissions: UserPermissionEntity[];
}
