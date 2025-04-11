export class EmployeeType {
    private static readonly type = {
        OWNER: "OWNER",
        EMPLOYEE: "EMPLOYEE"
    } as const;

    private readonly _value: keyof typeof EmployeeType['type'];

    constructor(value: keyof typeof EmployeeType['type']) {
        if (!EmployeeType.isValid(value)) {
            throw new Error(`Invalid value for EmployeeType: ${value}`);
        }
        this._value = value;
    }

    private static isValid(value: string): value is keyof typeof EmployeeType['type'] {
        return value === EmployeeType.type.OWNER || value === EmployeeType.type.EMPLOYEE;
    }

    public toString() {
        return this._value.toString();
    }

    public isOwner() {
        return this._value === EmployeeType.type.OWNER;
    }

    public isEmployee() {
        return this._value === EmployeeType.type.EMPLOYEE;
    }
}
