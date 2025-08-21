export interface QSManagerRolePermission {
    id: string,
    module: "COMPANIES" | "REVIEWS" | "ORGANIZATIONS" | "EMPLOYEES",
    permission: string
}

export interface QSManagerRoleDto {
    id: string,
    name: string,
    type: "MANAGER" | "ADMIN"
    permissions: QSManagerRolePermission[]
}
