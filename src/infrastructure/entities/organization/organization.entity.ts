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
import {OrganizationAddressEntity} from "@infrastructure/entities/organization/organization-address.entity";

@Entity('organization')
export class OrganizationEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({type: "uuid"})
    public companyId: string;

    @OneToOne(
        () => OrganizationAddressEntity,
            address => address.organization,
        {
            cascade: ["update", "insert", "soft-remove", "recover"],
            eager: true
        }
    )
    address: OrganizationAddressEntity;

    @OneToMany(() => OrganizationPlacementEntity, orgPlacement => orgPlacement.organization, {cascade: ["soft-remove"]})
    placements: OrganizationPlacementEntity[];

    @ManyToOne(() => CompanyEntity, (company) => company.organizations)
    @JoinColumn({ name: "company_id"})
    company: CompanyEntity;




    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;

}
