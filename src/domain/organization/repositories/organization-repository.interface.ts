import {Organization} from "@domain/organization/organization";
import {Placement} from "@domain/placement/placement";

export interface IOrganizationRepository {
    getActiveList(): Promise<Organization[]>;
    getById(id: string): Promise<Organization | null>;
    save(organization: Organization): Promise<void>;
    getPlacementById(placementId: string): Promise<Placement | null>
}
