import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {UniqueID} from "@domain/common/unique-id";
export class WorkingScheduleId extends UniqueID {}
export class WorkingSchedule {
    private readonly _id: WorkingScheduleId;
    private readonly _daily_hours: Map<DayOfWeek, DailyWorkingHours>;
    private _is_temporarily_closed: boolean;

    constructor(
        dailyHours: DailyWorkingHours[] = [],
        is_temporarily_closed: boolean = false

    ) {
        this._daily_hours = new Map();
        dailyHours.forEach(dh => this.addDailyHours(dh));
    }

    /**
     * @description Adds or updates daily working hours for a specific day.
     */
    public addDailyHours(dailyHours: DailyWorkingHours): void {
        this._daily_hours.set(dailyHours.dayOfWeek, dailyHours);
    }

    /**
     * @description Gets the daily working hours for a specific day.
     * Returns undefined if no hours are set for that day.
     */
    public getDailyHours(day: DayOfWeek): DailyWorkingHours | undefined {
        return this._daily_hours.get(day);
    }

    /**
     * @description Checks if the schedule is set for a specific day.
     */
    public hasDailyHours(day: DayOfWeek): boolean {
        return this._daily_hours.has(day);
    }

    /**
     * @description Removes daily working hours for a specific day.
     */
    public removeDailyHours(day: DayOfWeek): void {
        this._daily_hours.delete(day);
    }

    /**
     * @description Gets all set daily working hours.
     */
    public getAllDailyHours(): DailyWorkingHours[] {
        return Array.from(this._daily_hours.values());
    }

    /**
     * @description Provides a human-readable representation of the entire schedule.
     */
    public toString(): string {
        if (this._daily_hours.size === 0) {
            return "No working hours set.";
        }
        let scheduleString = "Working Schedule:\n";
        // Iterate through all days of the week to ensure consistent order
        for (const day of Object.values(DayOfWeek).filter(value => typeof value === 'number') as DayOfWeek[]) {
            const hours = this.getDailyHours(day);
            if (hours) {
                scheduleString += `- ${hours.toString()}\n`;
            } else {
                scheduleString += `- ${DayOfWeek[day]}: Not set\n`;
            }
        }
        return scheduleString;
    }

    get isTemporarilyClosed() {return this._is_temporarily_closed}
    get id() {return this._id}
}
