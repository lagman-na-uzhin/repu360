import {Time} from "@domain/organization/value-objects/working-hours/time.vo";

export class TimeRange {
    constructor(public readonly start: Time, public readonly end: Time) {
        if (start.isAfter(end)) {
            throw new Error('Invalid time range: Start time cannot be after end time.');
        }
    }

    /**
     * @description Formats the time range as HH:MM - HH:MM.
     */
    public toString(): string {
        return `${this.start.toString()} - ${this.end.toString()}`;
    }

    /**
     * @description Compares two TimeRange objects for equality.
     */
    public equals(other: TimeRange): boolean {
        return this.start.equals(other.start) && this.end.equals(other.end);
    }

    /**
     * @description Checks if a given time falls within this time range.
     */
    public contains(time: Time): boolean {
        return (time.isAfter(this.start) || time.equals(this.start)) &&
            (time.isBefore(this.end) || time.equals(this.end));
    }
}
