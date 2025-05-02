import {Role, RoleId} from "@domain/policy/model/role";

export interface IRoleRepository {
    save(role: Role): Promise<void>;
    getById(id: RoleId): Promise<Role | null>
}
