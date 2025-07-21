export class Time {
    constructor(public readonly hours: number, public readonly minutes: number) {
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error('Invalid time: Hours must be 0-23, Minutes 0-59.');
        }
    }

    public static fromString(str: string): Time {
        const [hoursStr, minutesStr] = str.split(':');
        const hours = Number(hoursStr);
        const minutes = Number(minutesStr);

        if (isNaN(hours) || isNaN(minutes)) {
            throw new Error(`Invalid time format: "${str}"`);
        }

        return new Time(hours, minutes);
    }

    public toString(): string {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
    }

    public equals(other: Time): boolean {
        return this.hours === other.hours && this.minutes === other.minutes;
    }

    public isBefore(other: Time): boolean {
        if (this.hours < other.hours) return true;
        if (this.hours === other.hours && this.minutes < other.minutes) return true;
        return false;
    }

    public isAfter(other: Time): boolean {
        if (this.hours > other.hours) return true;
        if (this.hours === other.hours && this.minutes > other.minutes) return true;
        return false;
    }
}
