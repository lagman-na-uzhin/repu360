import { LogMethod } from '@infrastructure/common/decorators/logging.decorator';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {Company, CompanyId} from "@domain/company/company";

export class ByIdCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    @LogMethod(ByIdCompanyUseCase.name)
    async execute(companyId: CompanyId): Promise<Company> {
        const company = await this.companyRepo.getById(companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        return company;
    }
}
