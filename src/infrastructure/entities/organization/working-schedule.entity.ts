import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Unique, PrimaryGeneratedColumn} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";

@Entity('organization_working_schedules')
@Unique(['organizationId', 'dayOfWeek'])
export class WorkingScheduleEntryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'organization_id' })
    organizationId: string;

    @Column({ type: 'enum', enum: DayOfWeek })
    dayOfWeek: DayOfWeek;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'time', nullable: true })
    breakStartTime: string | null;

    @Column({ type: 'time', nullable: true })
    breakEndTime: string | null;

    @ManyToOne(() => OrganizationEntity, organization => organization.workingSchedules, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization: OrganizationEntity;
}
