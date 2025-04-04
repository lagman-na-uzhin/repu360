import {ManagerPermission} from "@domain/manager/value-object/manager-permission";

export interface ICacheRepository {
    setUserAuthToken(userId: string, userPermissions: ManagerPermission | null): Promise<void>
}
