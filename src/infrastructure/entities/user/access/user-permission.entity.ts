import {
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Entity,
    PrimaryColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn
} from 'typeorm';
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";

@Entity('user_permission')
export class UserPermissionEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column({type: "uuid"})
    roleId: string;

    @Column()
    module: string;

    @Column()
    permission: string;

    @Column({ nullable: true, type: "varchar" })
    organizationId: string | null;

    @ManyToOne(() => UserRoleEntity, (role) => role.permissions, { onDelete: 'SET NULL' })
    @JoinColumn({name: "role_id"})
    role: UserRoleEntity;



    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
