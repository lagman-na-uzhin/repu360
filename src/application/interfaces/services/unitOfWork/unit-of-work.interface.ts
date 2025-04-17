import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";

export interface IUnitOfWork {
    employeeRepo: IEmployeeRepository;
    roleRepo: IRoleRepository;
    run<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
