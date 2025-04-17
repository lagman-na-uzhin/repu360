import {Company} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {CreateCompanyCommand} from '@application/use-cases/control/company/create/create-company.command';
import {CreateCompanyOutput} from "@application/use-cases/control/company/create/create-company.output";
import {ManagerId} from "@domain/manager/manager";
import {CompanyPolicy} from "@domain/policy/policies/company-policy";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";



export class CreateCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository
    ) {}

    async execute(cmd: CreateCompanyCommand): Promise<CreateCompanyOutput> {
        if (!cmd.actor.role.isManager() && !CompanyPolicy.canCreateCompany(cmd.actor)) {
            throw new Error(EXCEPTION.MANAGER.PERMISSION_DENIED);
        }

        const managerId = new ManagerId(cmd.actor.id.toString());

        const company = Company.create(
            managerId,
            cmd.companyName,
        );

        await this.companyRepo.save(company);

        return CreateCompanyOutput.of(company.id);
    }
}
