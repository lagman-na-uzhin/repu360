import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/get-list/get-employee-list.query";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {
    QSEmployeeWithRoleDto
} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";

export class GetEmployeeListUseCase {
    constructor(
        private readonly employeeQueryService: IEmployeeQs
    ) {}

    async execute(query: GetListEmployeeQuery):  Promise<PaginatedResult<QSEmployeeWithRoleDto>> {
        return this.employeeQueryService.getEmployeesWithRoleList(query);
    }
}
