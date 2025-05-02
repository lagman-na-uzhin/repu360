import {Manager, ManagerId} from "@domain/manager/manager";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";

export interface IManagerRepository {
    getById(id: ManagerId): Promise<Manager | null>;
    getByEmail(email: ManagerEmail): Promise<Manager | null>;
}
