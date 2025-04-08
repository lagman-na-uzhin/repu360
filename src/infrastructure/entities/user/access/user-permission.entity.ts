import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';
import {UserPermissionType} from "@domain/manager/value-object/manager-permission";
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";
import {PartnerUserRole} from "@domain/employee/model/employee-role";

@Entity('user_permission')
export class UserPermissionEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "varchar"})
    module: UserPermissionType;

    @ManyToOne(() => UserRoleEntity, (role) => role.permissions, { onDelete: 'SET NULL' })
    role: UserRoleEntity;

}
