export interface QSEmployeeWithRoleDto {
    id: string;
    name: string;
    role: {
        id: string;
        name: string;
        type: string
    }
}
