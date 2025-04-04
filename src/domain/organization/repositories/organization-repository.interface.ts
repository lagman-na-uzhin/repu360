import {Organization} from "@domain/organization/organization";
import {OrganizationPlacement} from "@domain/placement/platform-placement";

export interface IOrganizationRepository {
    getActiveList(): Promise<Organization[]>;
    getById(id: string): Promise<Organization | null>;
    save(organization: Organization): Promise<void>;
    getPlacementById(placementId: string): Promise<OrganizationPlacement | null>
}
