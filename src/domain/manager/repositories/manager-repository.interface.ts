import {Employee} from "@domain/company/model/employee/employee";

export interface IEmployeeRepository {
    getById(id: string): Promise<Employee | null>;
    getByEmail(email: string): Promise<Employee | null>;
}
