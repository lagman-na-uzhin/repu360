import {Employee} from "@domain/employee/employee";
import {Manager} from "@domain/manager/manager";

export interface ICacheRepository {
    setEmployeeAuth(employee: Employee): Promise<void>
    setManagerAuth(manager: Manager): Promise<void>
}
