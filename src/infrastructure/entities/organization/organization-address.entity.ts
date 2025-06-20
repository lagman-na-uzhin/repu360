import { OrganizationPlacementEntity } from '../placement/organization-placement.entity';
import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";

@Entity('organization_address')
export class OrganizationAddressEntity {
    @PrimaryColumn("uuid")
    public organizationId: string;

    @Column({ type: 'varchar', length: 100 })
    public country: string;

    @Column({ type: 'varchar', length: 100 })
    public region: string;

    @Column({ type: 'varchar', length: 100 })
    public district: string;

    @Column({ type: 'varchar', length: 255 })
    public street: string;

    @Column({ name: 'building_number', type: 'varchar', length: 20 })
    public buildingNumber: string;

    @Column({ name: 'apartment_number', type: 'varchar', length: 20, nullable: true })
    public apartmentNumber: string | null;

    @Column({ name: 'zip_code', type: 'varchar', length: 10, nullable: true })
    public zipCode: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;


    @OneToOne(() => OrganizationEntity, organization => organization.address)
    @JoinColumn({name: "organization_id"})
    organization: OrganizationPlacementEntity[];

}
