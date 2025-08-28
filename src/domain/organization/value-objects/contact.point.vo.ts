export enum ContactPointType {
    WHATSAPP = 'WHATSAPP',
        VIBER = 'VIBER',
        INSTAGRAM = 'INSTAGRAM',
        EMAIL = 'EMAIL',
        PHONE = 'PHONE', // General phone number
        TELEGRAM = 'TELEGRAM', // Example of adding a new type
        WEBSITE = 'WEBSITE',
}

export class ContactPoint {
    constructor(public readonly type: ContactPointType, private _value: string) {
        if (!_value || _value.trim() === '') {
            throw new Error(`Contact point value for type ${type} cannot be empty.`);
        }

        // Sanitize the value first to remove common noise
        this._value = this.sanitizeValue(_value);

        // Then validate the cleaned value
        this.validateFormat();
    }

    /**
     * @description Prepares the contact value by removing unnecessary characters.
     * This method ensures the value is in a consistent format for validation.
     */
    private sanitizeValue(value: string): string {
        switch (this.type) {
            case ContactPointType.WHATSAPP:
            case ContactPointType.VIBER:
            case ContactPointType.PHONE:
            case ContactPointType.TELEGRAM:
                // Removes all non-digit characters and plus signs, then adds a single leading '+' if it was there
                const sanitized = value.replace(/[^\d+]/g, '').trim();
                return sanitized.startsWith('+') ? sanitized : `+${sanitized}`;
            case ContactPointType.INSTAGRAM:
                // Removes a leading '@' and trims whitespace
                return value.replace(/^@/, '').trim();
            default:
                return value.trim();
        }
    }

    /**
     * @description Validates the format of the sanitized contact value based on its type.
     */
    private validateFormat(): void {
        let isValid = false;
        switch (this.type) {
            case ContactPointType.WHATSAPP:
            case ContactPointType.VIBER:
            case ContactPointType.PHONE:
            case ContactPointType.TELEGRAM:
                // Checks for a leading '+' followed by 10 to 15 digits
                isValid = /^\+\d{10,15}$/.test(this._value);
                break;
            case ContactPointType.INSTAGRAM:
                // Checks for a username with allowed characters
                isValid = /^(?!.*\.\.)(?!.*__)(?!^\.|^__)[a-z0-9_.]{1,30}$/i.test(this._value);
                break;
            case ContactPointType.EMAIL:
                // More robust email regex
                isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this._value);
                break;
            case ContactPointType.WEBSITE:
                // More comprehensive URL validation
                isValid = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i.test(this._value);
                break;
            default:
                isValid = true;
                break;
        }

        if (!isValid) {
            throw new Error(`Invalid format for ${this.type} contact: "${this._value}"`);
        }
    }

    public get value(): string {
        return this._value;
    }

    /**
     * @description Compares two ContactPoint objects for equality based on type and value.
     */
    public equals(other: ContactPoint): boolean {
        return this.type === other.type && this.value === other.value;
    }

    public toString(): string {
        return `${this.type}: ${this.value}`;
    }
}
