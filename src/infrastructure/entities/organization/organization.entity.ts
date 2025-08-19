import { OrganizationPlacementEntity } from '../placement/organization-placement.entity';
import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {WorkingScheduleEntity} from "@infrastructure/entities/organization/working-schedule.entity";
import {ContactPointEntity} from "@infrastructure/entities/organization/contact-point.entity";
import {OrganizationGroupEntity} from "@infrastructure/entities/organization/group.entity";
import {OrganizationRubricsEntity} from "@infrastructure/entities/organization/rubrics.entity";
import {OrganizationAddressEntity} from "@infrastructure/entities/organization/organization-address.entity";

@Entity('organization')
export class OrganizationEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({type: "uuid"})
    public companyId: string;

    @Column()
    public isActive: boolean;

    @OneToMany(() => OrganizationPlacementEntity, orgPlacement => orgPlacement.organization, {cascade: ["soft-remove"]})
    placements: OrganizationPlacementEntity[];

    @ManyToOne(() => CompanyEntity, (company) => company.organizations)
    @JoinColumn({ name: "company_id"})
    company: CompanyEntity;

    @OneToOne(
        () => WorkingScheduleEntity,
        workingSchedule => workingSchedule.organization,
        {cascade: ["soft-remove", "recover", "insert", "update"], eager: true}
    )
    workingSchedule: WorkingScheduleEntity;

    @OneToMany(
        () => OrganizationRubricsEntity,
        rubrics => rubrics.organization,
        {cascade: ["soft-remove", "recover", "insert", "update"], eager: true}
    )
    rubrics: OrganizationRubricsEntity[];

    @OneToMany(() => ContactPointEntity, contactPoint => contactPoint.organization)
    contactPoints: ContactPointEntity[];

    @ManyToOne(() => OrganizationGroupEntity, group => group.organization)
    group: OrganizationGroupEntity;

    @OneToOne(
        () => OrganizationAddressEntity,
        address => address.organization,
        {cascade: ["soft-remove", "recover", "insert", "update"], eager: true}
    )
    address: OrganizationAddressEntity;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;

}
