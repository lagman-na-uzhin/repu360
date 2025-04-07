CompanyName
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class CompanyName {
    private readonly value: string;

    constructor(name: string) {
        if (!this.isValid(name)) {
            throw new Error(EXCEPTION.COMPANY.INVALID_COMPANY_NAME);
        }
        this.value = name;
    }

    private isValid(name: string): boolean {
        return name.length >= 2 && name.length <= 50;
    }

    toString(): string {
        return this.value;
    }
}
