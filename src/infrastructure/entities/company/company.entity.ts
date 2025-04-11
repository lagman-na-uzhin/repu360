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

    @Column()
    public managerId: string;

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", nullable: true })
    public updatedAt: Date | null;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    public deletedAt: Date | null;

    @OneToMany(() => OrganizationEntity, (organization) => organization.company, { cascade: ['soft-remove'] })
    organizations: OrganizationEntity[]

    @OneToMany(() => UserEntity, (user) => user.company, { cascade: ['soft-remove'] })
    employees: UserEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.company, { cascade: ['soft-remove'] })
    subscriptions: SubscriptionEntity[];
}
