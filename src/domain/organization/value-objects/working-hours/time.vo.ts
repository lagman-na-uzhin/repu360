export class Time {
    constructor(public readonly hours: number, public readonly minutes: number) {
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error('Invalid time: Hours must be 0-23, Minutes 0-59.');
        }
    }

    /**
     * @description Formats the time as HH:MM.
     */
    public toString(): string {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
    }

    /**
     * @description Compares two Time objects for equality.
     */
    public equals(other: Time): boolean {
        return this.hours === other.hours && this.minutes === other.minutes;
    }

    /**
     * @description Checks if this time is before another time.
     */
    public isBefore(other: Time): boolean {
        if (this.hours < other.hours) return true;
        if (this.hours === other.hours && this.minutes < other.minutes) return true;
        return false;
    }

    /**
     * @description Checks if this time is after another time.
     */
    public isAfter(other: Time): boolean {
        if (this.hours > other.hours) return true;
        if (this.hours === other.hours && this.minutes > other.minutes) return true;
        return false;
    }
}
