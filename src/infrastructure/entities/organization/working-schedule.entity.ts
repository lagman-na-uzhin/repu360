import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {WorkingScheduleEntryEntity} from "@infrastructure/entities/organization/working-schedule-entries.entity";

@Entity('organization_working_schedules')
export class WorkingScheduleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'organization_id' })
    organizationId: string;

    @Column()
    isTemporaryClosed: boolean;

    @OneToMany(
        () => WorkingScheduleEntryEntity,
            entries => entries.schedule,
        { cascade: ['update', 'insert', 'recover', 'remove', 'soft-remove'] }
    )
    entries: WorkingScheduleEntryEntity[];

    @OneToOne(() => OrganizationEntity)
    @JoinColumn({name: 'organization_id'})
    organization: OrganizationEntity;
}
