import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {GetEmployeeListParams} from "@domain/employee/repositories/params/get-employee-list.params";

export interface IEmployeeRepository {
    getEmployeeList(params: GetEmployeeListParams): Promise<PaginatedResult<Employee>>
    getById(id: EmployeeId): Promise<Employee | null>
    emailIsExist(email: EmployeeEmail): Promise<boolean>;
    phoneIsExist(phone: EmployeePhone): Promise<boolean>;
    getByEmail(email: EmployeeEmail): Promise<Employee | null>;
    save(employee: Employee): Promise<void>;
}
