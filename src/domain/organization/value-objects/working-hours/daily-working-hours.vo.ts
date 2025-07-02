import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";

export class DailyWorkingHours {
    constructor(
        public readonly dayOfWeek: DayOfWeek,
        public readonly workingHours: TimeRange,
        public readonly breakTime?: TimeRange
    ) {
        if (breakTime) {
            // Ensure break time is within working hours
            if (!workingHours.contains(breakTime.start) || !workingHours.contains(breakTime.end)) {
                throw new Error('Break time must be within working hours.');
            }
        }
    }

    /**
     * @description Compares two DailyWorkingHours objects for equality.
     */
    public equals(other: DailyWorkingHours): boolean {
        const breakEquals = (this.breakTime && other.breakTime) ? this.breakTime.equals(other.breakTime) : !this.breakTime && !other.breakTime;
        return this.dayOfWeek === other.dayOfWeek &&
            this.workingHours.equals(other.workingHours) &&
            breakEquals;
    }

    /**
     * @description Returns a description of the daily working hours.
     */
    public toString(): string {
        let description = `${DayOfWeek[this.dayOfWeek]}: ${this.workingHours.toString()}`;
        if (this.breakTime) {
            description += ` (Break: ${this.breakTime.toString()})`;
        }
        return description;
    }
}
