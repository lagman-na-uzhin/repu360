import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {CompanyId} from "@domain/company/company";
import {ByIdCompanyControlOutput} from "@application/use-cases/control/company/queries/get-by-id/by-id-company.output";


export class ByIdCompanyControlUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async execute(companyId: CompanyId): Promise<ByIdCompanyControlOutput> {
        const company = await this.companyRepo.getById(companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        return ByIdCompanyControlOutput.of(company);
    }
}
