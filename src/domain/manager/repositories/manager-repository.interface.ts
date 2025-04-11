import {Employee} from "@domain/employee/employee";
import {ManagerId} from "@domain/manager/manager";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";

export interface IManagerRepository {
    getById(id: ManagerId): Promise<Employee | null>;
    getByEmail(email: ManagerEmail): Promise<Employee | null>;
}
