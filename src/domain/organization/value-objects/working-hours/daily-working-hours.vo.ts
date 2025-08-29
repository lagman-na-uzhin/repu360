import { DayOfWeek } from "@domain/common/consts/day-of-week.enums";
import { TimeRange } from "@domain/organization/value-objects/working-hours/time-range.vo";
import {UniqueID} from "@domain/common/unique-id";
import {WorkingScheduleId} from "@domain/organization/model/organization-working-hours";
export class DailyWorkingHours {
    private constructor(
        public readonly uniqueRelation: string,
        public readonly dayOfWeek: DayOfWeek,
        public readonly workingHours: TimeRange | null,
        public readonly breakTime: TimeRange | null
    ) {
        if (!workingHours && breakTime) {
            throw new Error('Cannot have a break time without working hours.');
        }
    }

    static create(scheduleId: WorkingScheduleId, dayOfWeek: DayOfWeek, workingHours: TimeRange | null, breakTime: TimeRange | null) {
        return new DailyWorkingHours(`${dayOfWeek}_${scheduleId}`,dayOfWeek, workingHours, breakTime);
    }

    static fromPersistence(id: string, dayOfWeek: DayOfWeek, workingHours: TimeRange | null, breakTime: TimeRange | null) {
        return new DailyWorkingHours(id, dayOfWeek, workingHours, breakTime);
    }
}
