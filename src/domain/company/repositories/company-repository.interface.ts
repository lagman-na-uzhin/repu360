import {Company, CompanyId} from "@domain/company/company";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {GetCompanyListParams} from "@domain/company/repositories/types/get-company-list.params";
import {PlacementId} from "@domain/placement/placement";

export interface ICompanyRepository {
    getById(id: CompanyId): Promise<Company | null>;
    save(company: Company): Promise<void>;
    getCompanyList(params: GetCompanyListParams): Promise<PaginatedResult<Company>>;

    getCompanyByPlacementId(placementId: PlacementId): Promise<Company | null>;
}
