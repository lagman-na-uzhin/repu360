export class RoleType {
    private static readonly _values = [
        "OWNER",
        "EMPLOYEE",
        "MANAGER",
        "ADMIN",
    ] as const;

    public static readonly Values = RoleType._values;
    public static type = {
        OWNER: "OWNER" as const,
        EMPLOYEE: "EMPLOYEE" as const,
        MANAGER: "MANAGER" as const,
        ADMIN: "ADMIN" as const,
    };

    private readonly _value: typeof RoleType._values[number];

    constructor(value: string) {
        if (!RoleType.isValid(value)) {
            throw new Error(`Invalid Role Type: ${value}`);
        }
        this._value = value as typeof RoleType._values[number];
    }

    static isValid(
        value: unknown
    ): value is typeof RoleType._values[number] {
        return (
            typeof value === "string" &&
            (RoleType._values as readonly string[]).includes(value)
        );
    }

    toString(): string {
        return this._value;
    }

    public equals(other: RoleType | typeof RoleType._values[number]): boolean {
        const otherValue =
            other instanceof RoleType ? other._value : other;
        return this._value === otherValue;
    }
}
