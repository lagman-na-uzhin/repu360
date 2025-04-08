import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";

export class SubscriptionPeriod {
    private readonly _start: Date;
    private readonly _end: Date;

    private constructor(start: Date, end: Date) {
        if (!SubscriptionPeriod.isValid(start, end)) {
            throw new Error(EXCEPTION.SUBSCRIPTION.INVALID_PERIOD);
        }

        this._start = start;
        this._end = end;
    }

    private static isValid(start: Date, end: Date): boolean { //valid is 30, 60, 90 ... days
        const diffInDays = Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        return start < end && diffInDays > 0 && diffInDays % 30 === 0;
    }

    public static createFromDays(days: number, start: Date = new Date()): SubscriptionPeriod {
        const end = new Date(start);
        end.setDate(end.getDate() + days);

        return new SubscriptionPeriod(start, end);
    }

    public get start(): Date {
        return this._start;
    }

    public get end(): Date {
        return this._end;
    }

    public getDays(): number {
        return Math.floor(
            (this._end.getTime() - this._start.getTime()) / (1000 * 60 * 60 * 24)
        );
    }
}
