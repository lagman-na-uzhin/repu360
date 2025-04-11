import {Organization, OrganizationId} from "@domain/organization/organization";
import {Placement} from "@domain/placement/placement";

export interface IOrganizationRepository {
    getActiveList(): Promise<Organization[]>;
    getById(id: OrganizationId): Promise<Organization | null>;
    save(organization: Organization): Promise<void>;
}
