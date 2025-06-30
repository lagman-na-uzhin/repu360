import { LogMethod } from '@infrastructure/common/decorators/logging.decorator';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {Company, CompanyId} from "@domain/company/company";
import {ByIdCompanyQuery} from "@application/use-cases/default/company/queries/by-id/by-id-company.query";

export class ByIdCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    @LogMethod(ByIdCompanyUseCase.name)
    async execute(cmd: ByIdCompanyQuery): Promise<Company> {
        const {actor, companyId} = cmd

        if (
            (actor.role.isEmployee() || actor.role.isOwner())
            && actor.companyId != companyId
        ) {
            throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);
        }

        const company = await this.companyRepo.getById(companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        return company;
    }
}
