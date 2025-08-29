import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {UniqueID} from "@domain/common/unique-id";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";
import {Time} from "@domain/organization/value-objects/working-hours/time.vo";

export class WorkingScheduleId extends UniqueID {}

export class WorkingSchedule {
    private readonly _id: WorkingScheduleId;
    private readonly _daily_hours: Map<DayOfWeek, DailyWorkingHours | null>;
    private _is_temporarily_closed: boolean;

    constructor(
        id: WorkingScheduleId,
        dailyHours: DailyWorkingHours[] = [],
        isTemporarilyClosed: boolean = false
    ) {
        this._id = id;
        this._daily_hours = new Map();
        this._is_temporarily_closed = isTemporarilyClosed;

        // Initialize the map with all days of the week set to null
        for (const day of Object.values(DayOfWeek).filter(value => typeof value === 'number') as DayOfWeek[]) {
            this._daily_hours.set(day, null);
        }

        dailyHours.forEach(dh => {
            this.validateDailyHours(dh);
            this.addDailyHours(dh);
        });
    }

    static create(dailyWorkingHours: DailyWorkingHours[], isTemporaryClosed: boolean, id?: WorkingScheduleId) {
        return new WorkingSchedule(id || new WorkingScheduleId(), dailyWorkingHours, isTemporaryClosed);
    }

    static fromPersistence(data: {
        id: string,
        isTemporaryClosed: boolean;
        entries: {
            uniqueRelation: string,
            dayOfWeek: DayOfWeek;
            startTime: string | null;
            endTime: string | null;
            breakStartTime: string | null;
            breakEndTime: string | null;
        }[];
    }): WorkingSchedule {
        const dailyHours: DailyWorkingHours[] = data.entries.map(entry => {
            let workingHours: TimeRange | null = null;

            if (entry.startTime && entry.endTime) {
                workingHours = new TimeRange(
                    Time.fromString(entry.startTime),
                    Time.fromString(entry.endTime)
                );
            }

            let breakTime: TimeRange | null = null;
            if (entry.breakStartTime && entry.breakEndTime) {
                breakTime = new TimeRange(
                    Time.fromString(entry.breakStartTime),
                    Time.fromString(entry.breakEndTime)
                );
            }
            return DailyWorkingHours.fromPersistence(entry.uniqueRelation, entry.dayOfWeek, workingHours, breakTime);
        });
        return new WorkingSchedule(WorkingScheduleId.of(data.id), dailyHours, data.isTemporaryClosed);
    }

    /**
     * @description Adds or updates daily working hours for a specific day.
     */
    public addDailyHours(dailyHours: DailyWorkingHours): void {
        this._daily_hours.set(dailyHours.dayOfWeek, dailyHours);
    }

    /**
     * @description Gets the daily working hours for a specific day.
     * Returns null if no hours are set for that day.
     */
    public getDailyHours(day: DayOfWeek): DailyWorkingHours | null {
        return this._daily_hours.get(day) || null;
    }

    /**
     * @description Checks if the schedule is set for a specific day.
     */
    public hasDailyHours(day: DayOfWeek): boolean {
        return this._daily_hours.get(day) !== null;
    }

    /**
     * @description Removes daily working hours for a specific day.
     */
    public removeDailyHours(day: DayOfWeek): void {
        this._daily_hours.set(day, null);
    }

    /**
     * @description Gets all set daily working hours.
     */
    public getAllDailyHours(): (DailyWorkingHours | null)[] {
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
                scheduleString += `- ${DayOfWeek[day]}: Closed\n`;
            }
        }
        return scheduleString;
    }

    get id() { return this._id }
    get isTemporarilyClosed() { return this._is_temporarily_closed }
    get dailyHours() { return this._daily_hours }

    private validateDailyHours(dh: DailyWorkingHours) {
        if (!dh.workingHours && dh.breakTime) {
            throw new Error('Cannot have a break time without working hours.');
        }

        if (dh.breakTime && dh.workingHours) {
            if (!dh.workingHours.contains(dh.breakTime.start) || !dh.workingHours.contains(dh.breakTime.end)) {
                throw new Error('Break time must be within working hours.');
            }
        }
    }
}
