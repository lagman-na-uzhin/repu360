import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {Company} from "@domain/company/company";
import {PaginatedResult} from "@domain/common/interfaces/repositories/paginated-result.interface";
import {GetListCompanyQuery} from "@application/use-cases/control/company/queries/get-list/get-list-company.query";

export class GetListCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async execute(query: GetListCompanyQuery): Promise<PaginatedResult<Company>> {
        return this.companyRepo.getList(query);
    }
}
