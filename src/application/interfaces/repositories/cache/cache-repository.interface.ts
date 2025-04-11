import {EmployeeRole} from "@domain/employee/model/employee-role";

export interface ICacheRepository {
    setUserAuthToken(userId: string, userPermissions: EmployeeRole | null): Promise<void>
}
