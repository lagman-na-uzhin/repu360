import { LogMethod } from '@infrastructure/common/decorators/logging.decorator';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CompanyPolicy} from "@domain/policy/policies/company-policy";
import {
    UpdateCompanyCommand
} from "@application/use-cases/default/company/commands/update-company/update-company.command";

export class UpdateCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    @LogMethod(UpdateCompanyUseCase.name)
    async execute(cmd: UpdateCompanyCommand): Promise<void> {
        if (!CompanyPolicy.canUpdateCompany(cmd.actor)) {
            throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);
        }
        const company = await this.companyRepo.getById(cmd.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        company.name = cmd.name;

        await this.companyRepo.save(company);
    }
}
