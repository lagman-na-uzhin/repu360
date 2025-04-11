export const REVIEW_PERMISSIONS = [
    "CAN_CREATE_REPLY",
    "CAN_CREATE_COMPLAINT",
    "CAN_VIEW_ANALYSIS", //TODO ITS DEMO
] as const;

export type ReviewPermission = typeof REVIEW_PERMISSIONS[number];

export class ReviewPermissions {
    private readonly _permissions: Set<ReviewPermission>;

    constructor(permissions: string[]) {
        if (!ReviewPermissions.isValid(permissions)) {
            throw new Error(`Invalid employee permissions: ${permissions}`);
        }

        this._permissions = new Set(permissions as ReviewPermission[]);
    }

    private static isValid(permissions: string[]): permissions is ReviewPermission[] {
        return permissions.every(
            (permission) => REVIEW_PERMISSIONS.includes(permission as ReviewPermission)
        );
    }

    public has(permission: ReviewPermission): boolean {
        return this._permissions.has(permission);
    }

    public get values(): ReviewPermission[] {
        return Array.from(this._permissions);
    }
}
