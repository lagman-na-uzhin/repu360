import {Employee} from "@domain/employee/employee";
import {Manager} from "@domain/manager/manager";
import {Role} from "@domain/policy/model/role";

export interface ICacheRepository {
    setEmployeeAuth(employee: Employee, role: Role): Promise<void>
    setManagerAuth(manager: Manager, role: Role): Promise<void>
}
