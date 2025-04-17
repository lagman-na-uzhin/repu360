import {Role} from "@domain/policy/model/role";

export interface IRoleRepository {
    save(role: Role): Promise<void>
}
