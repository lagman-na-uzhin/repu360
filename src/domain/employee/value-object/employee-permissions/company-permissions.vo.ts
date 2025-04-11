export const COMPANY_PERMISSIONS = [
    "CAN_EDIT_OWNER",
    "CAN_EDIT_COMPANY_DATA",
] as const;

export type CompanyPermission = typeof COMPANY_PERMISSIONS[number];

export class CompanyPermissions {
    private readonly _permissions: Set<CompanyPermission>;

    constructor(permissions: string[]) {
        if (!CompanyPermissions.isValid(permissions)) {
            throw new Error(`Invalid employee permissions: ${permissions}`);
        }

        this._permissions = new Set(permissions as CompanyPermission[]);
    }

    private static isValid(permissions: string[]): permissions is CompanyPermission[] {
        return permissions.every(
            (permission) => COMPANY_PERMISSIONS.includes(permission as CompanyPermission)
        );
    }

    public has(permission: CompanyPermission): boolean {
        return this._permissions.has(permission);
    }

    public get values(): CompanyPermission[] {
        return Array.from(this._permissions);
    }
}
