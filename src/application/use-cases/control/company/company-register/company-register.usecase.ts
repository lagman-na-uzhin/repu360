import { Company } from '@domain/company/company';
import { IEmployeeRepository } from '@domain/company/repositories/employee-repository.interface';
import { ICompanyRepository } from '@domain/company/repositories/company-repository.interface';
import { IHashService } from '@application/services/hash/hash-service.interface';
import { CompanyRegisterInput } from '@application/use-cases/control/company/company-register/company-register.input';
import { EmployeePassword } from '@domain/company/value-object/employee-user-password.vo';
import { Tariff } from '@domain/company/model/tariff/tariff';
import { TariffFeatures } from '@domain/company/types/tariff-features.types';
import { ITaskService } from '@application/services/task/task-service.interface';

export class RegisterPartnerUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly companyRepo: ICompanyRepository,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService
    ) {}

    async execute(input: CompanyRegisterInput): Promise<void> {
        const { hashedPassword, originalPassword } = await this.generatePassword();

        const company = this.createCompany(input, hashedPassword);

        await this.companyRepo.save(company);
        await this.initSendPasswordToEmailTask(originalPassword);
    }

    private createCompany(input: CompanyRegisterInput, hashedPassword: EmployeePassword): Company {
        const tariff = this.createTariff(input);
        return Company.create(
            input.manager.id,
            input.companyName,
            tariff,
            input.name,
            input.email,
            input.phone,
            hashedPassword,
            null
        );
    }

    private createTariff(input: CompanyRegisterInput): Tariff {
        const tariffFeatures: TariffFeatures = {
            companyDataSync: input.companyDataSync,
            reviewSync: input.reviewSync,
            multiAccess: input.multiAccess,
            registerPlacement: input.registerPlacement,
            reviewReply: input.reviewReply,
            reviewAutoReply: input.reviewAutoReply,
            reviewComplaint: input.reviewComplaint,
            reviewAutoComplaint: input.reviewAutoComplaint,
            analysisReview: input.analysisReview,
            analysisByRadius: input.analysisByRadius,
            analysisCompetitor: input.analysisCompetitor
        };
        return Tariff.create(input.isActive, input.price, tariffFeatures);
    }

    private async generatePassword(): Promise<{ hashedPassword: EmployeePassword; originalPassword: string }> {
        const originalPassword = `${Math.floor(Math.random() * (99999999 - 10000000) + 10000000)}`;
        const hashedPassword = await this.hashService.hash(originalPassword);
        return { hashedPassword: new EmployeePassword(hashedPassword), originalPassword };
    }

    private async initSendPasswordToEmailTask(originalPassword: string): Promise<void> {
        // await this.taskService.addTask({
        //     type: 'sendPasswordToEmail',
        //     data: { email: originalPassword }
        // });
    }
}
