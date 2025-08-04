import {Organization, OrganizationId} from "@domain/organization/organization";

export interface IOrganizationRepository {
    getActiveList(): Promise<Organization[]>;
    getById(id: OrganizationId): Promise<Organization | null>;
    save(organization: Organization): Promise<void>;
    getByIds(ids: OrganizationId[]): Promise<Organization[]>;
}
