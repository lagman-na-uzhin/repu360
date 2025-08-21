import {ManagerId} from "@domain/manager/manager";
import {
    QSManagerWithRoleDto
} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-with-role.dto";

export interface IManagerQs {
    getManagerWithRole(managerId: ManagerId): Promise<QSManagerWithRoleDto | null>
}
