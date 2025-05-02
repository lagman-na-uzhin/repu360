import {Company} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {CreateCompanyCommand} from '@application/use-cases/control/company/commands/create/create-company.command';
import {ManagerId} from "@domain/manager/manager";
import {CompanyPolicy} from "@domain/policy/policies/company-policy";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class CreateCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository
    ) {}

    async execute(cmd: CreateCompanyCommand): Promise<void> {
        if (!CompanyPolicy.canCreateCompany(cmd.actor)) {
            throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);
        }

        const managerId = new ManagerId(cmd.actor.id.toString());

        const company = Company.create(
            managerId,
            cmd.companyName,
        );

        await this.companyRepo.save(company);
    }
}
