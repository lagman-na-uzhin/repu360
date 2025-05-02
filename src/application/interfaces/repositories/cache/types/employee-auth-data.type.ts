import {OrganizationId} from "@domain/organization/organization";

type Role = {
    id: string;
    name: string | null;
    type: string;
    permissions: {
        reviews: { organizationId: string; permissions: string[] }[];
        companies: string[];
    }
}
export type EmployeeAuthDataType = {
    id: string;
    role: Role;
}
