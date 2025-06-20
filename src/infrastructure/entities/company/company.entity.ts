import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {SubscriptionEntity} from "@infrastructure/entities/subscription/subscription.entity";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";

@Entity('company')
export class CompanyEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({type: 'uuid'})
    public managerId: string;

    @OneToMany(() => OrganizationEntity, (organization) => organization.company, { cascade: ['soft-remove'] })
    organizations: OrganizationEntity[]

    @OneToMany(() => UserEntity, (user) => user.company, { cascade: ['soft-remove'] })
    employees: UserEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.company, { cascade: ['soft-remove'] })
    subscriptions: SubscriptionEntity[];


    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
