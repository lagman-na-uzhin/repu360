import {EmployeeRole} from "@domain/company/model/employee/employee-role";

export interface ICacheRepository {
    setUserAuthToken(userId: string, userPermissions: EmployeeRole | null): Promise<void>
}
