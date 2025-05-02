import {PrimaryGeneratedColumn, Column, ManyToOne, Entity, PrimaryColumn, JoinColumn} from 'typeorm';
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";

@Entity('user_permission')
export class UserPermissionEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    roleId: string;

    @Column()
    module: "COMPANIES" | "REVIEWS";

    @Column()
    permission: string;

    @Column({ nullable: true, type: "varchar" })
    organizationId: string | null;

    @ManyToOne(() => UserRoleEntity, (role) => role.permissions, { onDelete: 'SET NULL' })
    @JoinColumn({name: "role_id"})
    role: UserRoleEntity;

}
