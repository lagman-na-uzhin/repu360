import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Unique, PrimaryGeneratedColumn} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {WorkingScheduleEntity} from "@infrastructure/entities/organization/working-schedule.entity";

@Entity('working_schedule_entries')
@Unique(['scheduleId', 'dayOfWeek'])
export class WorkingScheduleEntryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'schedule_id' })
    scheduleId: string;

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

    @ManyToOne(() => WorkingScheduleEntity, schedule => schedule.entries)
    @JoinColumn({ name: 'schedule_id' })
    schedule: WorkingScheduleEntity;
}
