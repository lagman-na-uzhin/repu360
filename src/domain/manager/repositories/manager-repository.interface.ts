import {Employee} from "@domain/employee/employee";

export interface IEmployeeRepository {
    getById(id: string): Promise<Employee | null>;
    getByEmail(email: string): Promise<Employee | null>;
}
