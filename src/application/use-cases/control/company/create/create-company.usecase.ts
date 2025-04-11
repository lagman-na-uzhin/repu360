import {Company} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {CreateCompanyInput} from '@application/use-cases/control/company/create/create-company.input';
import {CreateCompanyOutput} from "@application/use-cases/control/company/create/create-company.output";


export class CreateCompanyUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
    ) {}

    async execute(input: CreateCompanyInput): Promise<CreateCompanyOutput> {
        const company = Company.create(
            input.manager.id,
            null,
            input.companyName,
        )
        await this.companyRepo.save(company);

        return CreateCompanyOutput.of(company.id);
    }
}
