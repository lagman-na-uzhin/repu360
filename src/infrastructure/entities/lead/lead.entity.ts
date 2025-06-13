import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {SubscriptionEntity} from "@infrastructure/entities/subscription/subscription.entity";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";
import {LeadContactEntity} from "@infrastructure/entities/lead/lead-contact.entity";

@Entity('lead')
export class LeadEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column({ type: "uuid", nullable: true })
    public managerId: string | null;

    @Column({ type: "timestamptz", nullable: true })
    public processedAt: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", nullable: true })
    public updatedAt: Date | null;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    public deletedAt: Date | null;

    @OneToOne(() => LeadContactEntity, (contact) => contact.lead, { cascade: ['soft-remove', 'insert', 'update'] })
    contact: LeadContactEntity
}
