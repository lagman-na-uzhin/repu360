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

    @OneToOne(() => LeadContactEntity, (contact) => contact.lead, { cascade: ['soft-remove', 'insert', 'update'] })
    contact: LeadContactEntity;


    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
