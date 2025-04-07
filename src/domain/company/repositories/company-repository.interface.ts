import {Company} from "@domain/company/company";

export interface ICompanyRepository {
    getById(id: string): Promise<Company | null>
    save(partner: Company): Promise<void>
}
