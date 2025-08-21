
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
    constructor(public readonly type: ContactPointType, public readonly value: string) {
        if (!value || value.trim() === '') {
            throw new Error(`Contact point value for type ${type} cannot be empty.`);
        }
        this.value = value.trim();
        this.validateFormat(); // Validate based on type
    }

    /**
     * @description Validates the format of the contact value based on its type.
     * This method centralizes validation logic for all contact types.
     */
    private validateFormat(): void {
        let isValid = false;
        switch (this.type) {
            case ContactPointType.WHATSAPP:
            case ContactPointType.VIBER:
            case ContactPointType.PHONE:
            case ContactPointType.TELEGRAM:
                // Basic phone number format: starts with '+' and contains 10-15 digits
                isValid = /^\+\d{10,15}$/.test(this.value);
                break;
            case ContactPointType.INSTAGRAM:
                // Instagram username (@username) or URL
                isValid = /^(@[\w.]+|https?:\/\/(?:www\.)?instagram\.com\/[\w.]+\/?)$/i.test(this.value);
                break;
            case ContactPointType.EMAIL:
                // Basic mail regex
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
                break;
            case ContactPointType.WEBSITE:
                // Basic URL validation
                isValid = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(this.value);
                break;
            default:
                // If a new type is added without specific validation, default to true or throw
                isValid = true;
                break;
        }

        if (!isValid) {
            throw new Error(`Invalid format for ${this.type} contact: "${this.value}"`);
        }
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
