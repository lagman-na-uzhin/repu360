import {Organization, OrganizationId} from "@domain/organization/organization";
import {Placement} from "@domain/placement/placement";
import {CompanyId} from "@domain/company/company";
import {PaginatedResult} from "@domain/common/interfaces/repositories/paginated-result.interface";
import {GetOrganizationListByCompanyParams} from "@domain/organization/repositories/params/get-list-by-company.params";

export interface IOrganizationRepository {
    getActiveList(): Promise<Organization[]>;
    getById(id: OrganizationId): Promise<Organization | null>;
    save(organization: Organization): Promise<void>;
    getListByCompanyId(params: GetOrganizationListByCompanyParams): Promise<PaginatedResult<Organization>>
}
