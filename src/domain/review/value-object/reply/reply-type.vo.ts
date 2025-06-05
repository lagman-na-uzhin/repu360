enum Types {
    SENT = "SENT",
    EXTERNAL = "EXTERNAL",
}

export class ReplyType {
    private constructor(private readonly _value: Types) {}

    static readonly SENT = new ReplyType(Types.SENT);
    static readonly EXTERNAL = new ReplyType(Types.EXTERNAL);

    static from(value: string): ReplyType {
        if (!this.isValid(value)) {
            throw new Error(`Invalid ReplyType value: ${value}`);
        }
        return new ReplyType(value as Types);
    }

    static isValid(value: string): value is Types {
        return Object.values(Types).includes(value as Types);
    }

    equals(other: ReplyType): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }

    get value(): Types {
        return this._value;
    }
}
