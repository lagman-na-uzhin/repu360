export class RoleType {
private static readonly type = {
        OWNER: "OWNER",
        EMPLOYEE: "EMPLOYEE",

        MANAGER: "MANAGER",
        ADMIN: "ADMIN"
    } as const;

    private readonly _value: keyof typeof RoleType['type'];

    constructor(value: keyof typeof RoleType['type'] | string) {
        if (!RoleType.isValid(value)) {
            throw new Error(`Invalid value for EmployeeType: ${value}`);
        }
        this._value = value;
    }

    static fromPersistence(value: string): RoleType {
        if (!RoleType.isValid(value)) {
            throw new Error(`Invalid value for EmployeeType: ${value}`);
        }
        return new RoleType(value as keyof typeof RoleType['type']);
    }


    private static isValid(value: string): value is keyof typeof RoleType['type'] {
        return value === RoleType.type.OWNER || value === RoleType.type.EMPLOYEE;
    }

    public toString() {
        return this._value.toString();
    }

    public isStaff() {
        return this._value === RoleType.type.ADMIN || this._value === RoleType.type.MANAGER;
    }

    public isCompanyOwner() {
        return this._value === RoleType.type.OWNER;
    }

    public isCompanyEmployee() {
        return this._value === RoleType.type.EMPLOYEE;
    }

    public isManager() {
        return this._value === RoleType.type.MANAGER;
    }

    public isAdmin() {
        return this._value === RoleType.type.ADMIN;
    }
}
