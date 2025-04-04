import {OrganizationPlacement} from "@domain/placement/platform-placement";

export interface IPlacementRepository {
    save(placement: OrganizationPlacement): Promise<OrganizationPlacement>
    getACtiveTwogisPlacements(): Promise<OrganizationPlacement[]>
}
