import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {Company, CompanyId} from "@domain/company/company";


export class ByIdCompanyControlUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async execute(companyId: CompanyId): Promise<Company> {
        const company = await this.companyRepo.getById(companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        return company;
    }
}
