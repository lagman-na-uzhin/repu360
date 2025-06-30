import { OrganizationPlacementEntity } from '../placement/organization-placement.entity';
import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';

@Entity('organization')
export class OrganizationEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({type: "uuid"})
    public companyId: string;

    @Column()
    address: string;

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
