import {QSEmployeeWithRoleDto} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/get-list/get-employee-list.query";

export interface IEmployeeQs {
    getEmployeesWithRoleList(query: GetListEmployeeQuery): Promise<PaginatedResult<QSEmployeeWithRoleDto>>
}
