import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class LeadContactPhone {
    private readonly value: string;

    constructor(phone: string) {
        if (!this.isValid(phone)) {
            throw new Error(EXCEPTION.COMMON.INVALID_PHONE);
        }
        this.value = phone;
    }

    private isValid(phone: string): boolean {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Поддержка международного формата E.164
        return phoneRegex.test(phone);
    }

    toString(): string {
        return this.value;
    }
}
