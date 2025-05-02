
type Role = {
    id: string;
    name: string | null;
    type: string;
    permissions: {
        companies: string[];
    }
}
export type ManagerAuthDataType = {
    id: string;
    role: Role;
}
