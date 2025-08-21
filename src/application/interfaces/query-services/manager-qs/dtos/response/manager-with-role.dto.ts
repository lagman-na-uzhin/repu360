import {QSManagerRoleDto} from "@application/interfaces/query-services/manager-qs/dtos/response/manager-role.dto";

export interface QSManagerWithRoleDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    role: QSManagerRoleDto,

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
