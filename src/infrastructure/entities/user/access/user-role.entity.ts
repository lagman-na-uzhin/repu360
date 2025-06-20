import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    Unique,
    UpdateDateColumn
} from 'typeorm';
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



    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
