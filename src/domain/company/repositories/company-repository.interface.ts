import {Company, CompanyId} from "@domain/company/company";

export interface ICompanyRepository {
    getById(id: CompanyId): Promise<Company | null>
    save(partner: Company): Promise<void>
}
