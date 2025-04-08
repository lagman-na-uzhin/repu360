import { Company } from '@domain/company/company';
import { ICompanyRepository } from '@domain/company/repositories/company-repository.interface';
import { IHashService } from '@application/services/hash/hash-service.interface';
import { CreateCompanyInput } from '@application/use-cases/control/company/create/create-company.input';
import { ITaskService } from '@application/services/task/task-service.interface';
import {ILeadRepository} from "@domain/manager/repositories/lead-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {CompanyOwner} from "@domain/company/model/company-owner";
import {OwnerName} from "@domain/company/value-object/owner-name.vo";
import {OwnerEmail} from "@domain/company/value-object/owner-email.vo";
import {OwnerPhone} from "@domain/company/value-object/owner-phone.vo";
import {OwnerPassword} from "@domain/company/value-object/owner-password.vo";

export class RegisterPartnerUseCase {
    constructor(
        private readonly leadRepo: ILeadRepository,
        private readonly companyRepo: ICompanyRepository,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService
    ) {}

    async execute(input: CreateCompanyInput): Promise<void> {
        const lead = await this.leadRepo.getById(input.leadId.toString());
        if (!lead) throw new Error(EXCEPTION.LEAD.NOT_FOUND);

        const {originalPassword, hashedPassword} = await this.generatePassword()

        const companyOwner = this.createCompanyOwner(
            lead.contact.name,
            lead.contact.email,
            lead.contact.phone,
            new OwnerPassword(hashedPassword)
        )

        const company = Company.create(
            input.manager.id,
            null,
            input.companyName,
            companyOwner
        )

        await this.companyRepo.save(company);
        await this.initSendPasswordToEmailTask(originalPassword);
    }

    private createCompanyOwner(
        ownerName: OwnerName,
        ownerEmail: OwnerEmail,
        ownerPhone: OwnerPhone,
        ownerPassword: OwnerPassword
    ) {
        return CompanyOwner.create(ownerName, ownerEmail, ownerPhone, ownerPassword, null)
    }

    private async generatePassword(): Promise<{ hashedPassword: string; originalPassword: string }> {
        const originalPassword = `${Math.floor(Math.random() * (99999999 - 10000000) + 10000000)}`;
        const hashedPassword = await this.hashService.hash(originalPassword);
        return { hashedPassword, originalPassword };
    }

    private async initSendPasswordToEmailTask(originalPassword: string): Promise<void> {
        // await this.taskService.addTask({
        //     type: 'sendPasswordToEmail',
        //     data: { email: originalPassword }
        // });
    }
}
