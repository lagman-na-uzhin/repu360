import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {Employee} from "@domain/employee/employee";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/get-list/get-employee-list.query";

export class GetEmployeeListUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
    ) {}

    async execute(query: GetListEmployeeQuery): Promise<PaginatedResult<Employee>> {
        return this.employeeRepo.getEmployeeList(query);
    }
}
