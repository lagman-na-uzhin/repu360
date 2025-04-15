type Role = {
    id: string;
    name: string | null;
    type: string;
    permissions: {
        companies: Set<string>
    }
}
export type EmployeeAuthDataType = {
    id: string;
    role: Role;
}
