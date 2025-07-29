import {Employee} from "@domain/employee/employee";
import {Manager} from "@domain/manager/manager";
import {Role} from "@domain/policy/model/role";
import {OrganizationId} from "@domain/organization/organization";
import {PlacementId} from "@domain/placement/placement";
import {
    ILoginTwogisCabinetResult
} from "@application/interfaces/integrations/twogis/client/dto/out/login-cabinet.out.dto";

export interface ICacheRepository {
    setEmployeeAuth(employee: Employee, role: Role): Promise<void>
    setManagerAuth(manager: Manager, role: Role): Promise<void>

    hasTwogisReplyCooldown(placementId: PlacementId): Promise<boolean>
    setTwogisReplyCooldown(placementId: PlacementId): Promise<void>

    getTwogisCabinetAuth(placementId: PlacementId): Promise<{accessToken: string}>
    setTwogisCabinetAuth(authData: ILoginTwogisCabinetResult, ttl: number): Promise<void>
    deleteTwogisCabinetAuth(placementId: PlacementId): Promise<void>


    hasProxyCooldown(proxyId: string): Promise<boolean>
    setProxyCooldown(proxyId: string): Promise<void>
}
