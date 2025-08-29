export class UniqueID {
    private readonly _value: string;

    constructor(id?: string) {
        this._value = id ?? UniqueID.generateUUIDv4();
    }

    static of(id: string) {
        if (!UniqueID.isValidUUIDv4(id)) {
            throw new Error("Invalid UUID format");
        }
        return new UniqueID(id);
    }

    toString(): string {
        return this._value;
    }

    private static generateUUIDv4(): string {
        const random32bit = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${random32bit()}${random32bit()}-${random32bit()}-${random32bit()}-${random32bit()}-${random32bit()}${random32bit()}${random32bit()}`;
    }

    private static isValidUUIDv4(id: string): boolean {
        if (id.length !== 36) {
            return false;
        }
        return id[8] === '-' && id[13] === '-' && id[18] === '-' && id[23] === '-';
    }
}
