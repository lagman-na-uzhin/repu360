
import {QSEmployeeRoleDto} from "@application/interfaces/query-services/employee-qs/dtos/response/employee-role.dto";

export interface QSEmployeeWithRoleDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    companyId: string | null;

    role: QSEmployeeRoleDto,

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
