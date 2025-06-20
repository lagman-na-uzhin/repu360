import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {SubscriptionEntity} from "@infrastructure/entities/subscription/subscription.entity";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";
import {LeadEntity} from "@infrastructure/entities/lead/lead.entity";

@Entity('lead-contact')
export class LeadContactEntity {
    @PrimaryColumn("uuid")
    public leadId: string;

    @Column()
    public companyName: string;

    @Column()
    public phone: string;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @OneToOne(() => LeadEntity, (lead) => lead.contact)
    @JoinColumn({name: "lead_id"})
    lead: LeadEntity[]




    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
