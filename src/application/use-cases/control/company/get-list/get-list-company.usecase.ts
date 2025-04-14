import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {Company, CompanyId} from "@domain/company/company";
import {ByIdCompanyControlOutput} from "@application/use-cases/control/company/get-by-id/by-id-company.output";
import {PaginatedResult} from "@domain/common/interfaces/repositories/paginated-result.interface";


export class GetListCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async execute(companyId: CompanyId): Promise<PaginatedResult<Company>> {
        return this.companyRepo.getList()
    }
}
