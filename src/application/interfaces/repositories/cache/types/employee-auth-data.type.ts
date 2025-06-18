type Role = {
    id: string;
    name: string | null;
    type: string;
    permissions: {
        reviews: { organizationId: string; permissions: string[] }[];
        organizations: { organizationId: string; permissions: string[] }[];
        companies: string[];
    }
}
export type EmployeeAuthDataType = {
    id: string;
    role: Role;
}
