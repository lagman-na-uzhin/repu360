import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Unique, PrimaryGeneratedColumn} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {WorkingScheduleEntity} from "@infrastructure/entities/organization/working-schedule.entity";

@Entity('working_schedule_entries')
@Unique(['scheduleId', 'dayOfWeek'])
export class WorkingScheduleEntryEntity {
    @PrimaryColumn()
    uniqueRelation: string;

    @Column({ name: 'schedule_id' })
    scheduleId: string;

    @Column({ type: 'enum', enum: DayOfWeek })
    dayOfWeek: DayOfWeek;

    @Column({ type: 'time', nullable: true, default: null })
    startTime: string | null;

    @Column({ type: 'time', nullable: true, default: null })
    endTime: string | null;

    @Column({ type: 'time', nullable: true, default: null })
    breakStartTime: string | null;

    @Column({ type: 'time', nullable: true, default: null })
    breakEndTime: string | null;

    @ManyToOne(() => WorkingScheduleEntity, schedule => schedule.entries)
    @JoinColumn({ name: 'schedule_id' })
    schedule: WorkingScheduleEntity;
}
