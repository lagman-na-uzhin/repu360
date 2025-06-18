import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class LeadContactCompanyName {
    private readonly value: string;

    constructor(phone: string) {
        if (!this.isValid(phone)) {
            throw new Error(EXCEPTION.COMMON.INVALID_NAME);
        }
        this.value = phone;
    }

    private isValid(name: string): boolean {
        return name.length > 2
    }

    toString(): string {
        return this.value;
    }
}
