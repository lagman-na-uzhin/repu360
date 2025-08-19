import { OrganizationPlacementEntity } from '../placement/organization-placement.entity';
import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";


@Entity('organization_address')
export class OrganizationAddressEntity {
    @PrimaryColumn("uuid")
    public organizationId: string;

    @Column()
    public city: string;

    @Column()
    public address: string;

    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;

    @OneToOne(() => OrganizationEntity, (organization) => organization.address)
    @JoinColumn({ name: "organization_id"})
    organization: OrganizationEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;

}
