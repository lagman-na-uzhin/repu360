import { DayOfWeek } from "@domain/common/consts/day-of-week.enums";
import { TimeRange } from "@domain/organization/value-objects/working-hours/time-range.vo";

export class DailyWorkingHours {
    private constructor(
        public readonly dayOfWeek: DayOfWeek,
        public readonly workingHours: TimeRange | null,
        public readonly breakTime: TimeRange | null
    ) {
        if (!workingHours && breakTime) {
            throw new Error('Cannot have a break time without working hours.');
        }
    }

    static create(dayOfWeek: DayOfWeek, workingHours: TimeRange | null, breakTime: TimeRange | null) {
        return new DailyWorkingHours(dayOfWeek, workingHours, breakTime);
    }

    static fromPersistence(dayOfWeek: DayOfWeek, workingHours: TimeRange | null, breakTime: TimeRange | null) {
        return new DailyWorkingHours(dayOfWeek, workingHours, breakTime);
    }
}
