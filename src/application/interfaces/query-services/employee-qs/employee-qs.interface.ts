import {QSEmployeeWithRoleDto} from "@application/interfaces/query-services/employee-qs/dtos/response/employees-with-role.dto";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {GetListEmployeeQuery} from "@application/use-cases/default/employee/queries/get-list/get-employee-list.query";
import {CompanyId} from "@domain/company/company";
import {QSEmployeeRoleDto} from "@application/interfaces/query-services/employee-qs/dtos/response/employee-role.dto";
import {EmployeeId} from "@domain/employee/employee";

export interface IEmployeeQs {
    getEmployeeWithRole(employeeId: EmployeeId): Promise<QSEmployeeWithRoleDto | null>
    getEmployeesWithRoleList(query: GetListEmployeeQuery): Promise<PaginatedResult<QSEmployeeWithRoleDto>>
    getEmployeeRoles(companyId: CompanyId): Promise<QSEmployeeRoleDto[]>
}
