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
        const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidv4Regex.test(id);
    }
}
