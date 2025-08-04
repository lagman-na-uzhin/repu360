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
import {WorkingScheduleEntryEntity} from "@infrastructure/entities/organization/working-schedule.entity";
import {ContactPointEntity} from "@infrastructure/entities/organization/contact-point.entity";
import {OrganizationGroupEntity} from "@infrastructure/entities/organization/group.entity";
import {OrganizationRubricsEntity} from "@infrastructure/entities/organization/rubrics.entity";

@Entity('organization')
export class OrganizationEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({type: "uuid"})
    public companyId: string;

    @Column()
    public address: string

    @Column({default: true})
    public isActive: boolean;

    @Column()
    public isTemporarilyClosed: boolean;

    @OneToMany(() => OrganizationPlacementEntity, orgPlacement => orgPlacement.organization, {cascade: ["soft-remove"]})
    placements: OrganizationPlacementEntity[];

    @ManyToOne(() => CompanyEntity, (company) => company.organizations)
    @JoinColumn({ name: "company_id"})
    company: CompanyEntity;

    @OneToMany(
        () => WorkingScheduleEntryEntity,
        workingSchedules => workingSchedules.organization,
        {cascade: ["soft-remove", "recover", "insert", "update"], eager: true}
    )
    workingSchedules: WorkingScheduleEntryEntity[];

    @OneToMany(
        () => OrganizationRubricsEntity,
        rubrics => rubrics.organization,
        {cascade: ["soft-remove", "recover", "insert", "update"], eager: true}
    )
    rubrics: OrganizationRubricsEntity[];

    @OneToMany(() => ContactPointEntity, contactPoint => contactPoint.organization)
    contactPoints: ContactPointEntity[];

    @ManyToOne(() => OrganizationGroupEntity, group => group.organization)
    group: OrganizationGroupEntity[];


    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;

}
