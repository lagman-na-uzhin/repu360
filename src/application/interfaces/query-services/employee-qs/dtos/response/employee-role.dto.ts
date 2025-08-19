export interface QSEmployeeRolePermission {
    id: string,
    module: "COMPANIES" | "REVIEWS" | "ORGANIZATIONS" | "EMPLOYEES",
    permission: string
}

export interface QSEmployeeRoleDto {
    id: string,
    name: string | null,
    type: "EMPLOYEE" | "OWNER"
    permissions: QSEmployeeRolePermission[]
}
