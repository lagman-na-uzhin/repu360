import {PrimaryGeneratedColumn, Column, ManyToOne, Entity, PrimaryColumn} from 'typeorm';
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";

@Entity('user_permission')
export class UserPermissionEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    permission: string;

    @Column({ nullable: true })
    organizationId: string | null;

    @ManyToOne(() => UserRoleEntity, (role) => role.permissions, { onDelete: 'SET NULL' })
    role: UserRoleEntity;

}
