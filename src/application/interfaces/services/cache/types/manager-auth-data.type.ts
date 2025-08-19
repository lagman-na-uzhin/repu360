
type Role = {
    id: string;
    name: string;
    type: string;
    permissions: {
        companies: string[];
        leads: string[];
    }
}
export type ManagerAuthDataType = {
    id: string;
    role: Role;
}
