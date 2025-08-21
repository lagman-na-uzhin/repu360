type Role = {
    id: string;
    name: string;
    type: string;
    permissions: {
        reviews: { organizationId: string; permissions: string[] }[];
        organizations: { organizationId: string; permissions: string[] }[];
        companies: string[];
        employees: string[];
    }
}
export type EmployeeAuthDataType = {
    id: string;
    companyId: string;
    role: Role;
}
