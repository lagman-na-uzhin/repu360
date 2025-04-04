export const PERMISSION_MODULES = {
    PARTNER: ["REGISTER_PARTNER", "HANDLE_LEAD"],
    USER: ["CREATE_USER", "UPDATE_USER"],

} as const;

type PermissionModules = keyof typeof PERMISSION_MODULES;
type UserPermissionType = typeof PERMISSION_MODULES[PermissionModules][number];


export class ManagerPermission {
    private constructor(
        readonly _module: UserPermissionType
    ) {}

    static create(module: UserPermissionType) {
        return new ManagerPermission(module);
    }

    static fromPersistence(module: UserPermissionType) {
        return new ManagerPermission(module);
    }
}
