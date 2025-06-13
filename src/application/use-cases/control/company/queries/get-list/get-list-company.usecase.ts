import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {Company} from "@domain/company/company";
import {GetListCompanyQuery} from "@application/use-cases/control/company/queries/get-list/get-list-company.query";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";

export class GetListCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async execute(query: GetListCompanyQuery): Promise<PaginatedResult<Company>> {
        return this.companyRepo.getList(query);
    }
}
