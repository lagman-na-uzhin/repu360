import { ConfirmLeadCommand } from "@application/use-cases/control/lead/commands/confirm/confirm-lead.command";
import { ILeadRepository } from "@domain/lead/repositories/lead-repository.interface";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";
import {Company, CompanyId} from "@domain/company/company";
import { IUnitOfWork } from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import { Employee } from "@domain/employee/employee";
import {Role, RoleId} from "@domain/policy/model/role";
import { Lead } from "@domain/lead/lead";
import { EmployeePassword } from "@domain/employee/value-object/employee-password.vo";
import { IHashService } from "@application/interfaces/services/hash/hash-service.interface";
import { ITaskService, QUEUE_TYPE, QUEUES } from "@application/interfaces/services/task/task-service.interface";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {CompanyName} from "@domain/company/value-object/company-name.vo";
import {LeadContactCompanyName} from "@domain/manager/value-object/lead/lead-contact-company-name.vo";
import {ManagerId} from "@domain/manager/manager";
import {LeadContactName} from "@domain/manager/value-object/lead/lead-contact-name.vo";
import {LeadContactPhone} from "@domain/manager/value-object/lead/lead-contact-phone.vo";
import {Tariff} from "@domain/subscription/model/tariff";
import {OrganizationCountRange, TariffFeatures} from "@domain/subscription/model/tariff-feature";

export class ConfirmLeadUseCase {
    constructor(
        private readonly leadRepository: ILeadRepository,
        private readonly uof: IUnitOfWork,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService
    ) {}

    async execute(command: ConfirmLeadCommand): Promise<void> {
        console.log("ConfirmLeadUseCase ConfirmLeadUseCase ConfirmLeadUseCase")
        const leadToConfirm = await this.leadRepository.getById(command.leadId);
        if (!leadToConfirm) {
            throw new Error(EXCEPTION.LEAD.NOT_FOUND);
        }
        console.log(leadToConfirm, "leadToConfirmleadToConfirmleadToConfirmleadToConfirm")
        const newCompany = this.createCompany(
            command?.companyName || leadToConfirm.contact.companyName,
            command.actor.id
        );
        console.log(newCompany, "companyu")

        const ownerRole = Role.createCompanyOwnerRole();

        const { originalPassword, hashedPassword } = await this.generateOwnerPassword();

        const newCompanyOwner = this.createCompanyOwner(
            newCompany.id,
            ownerRole.id,
            hashedPassword,
            command?.contactName || leadToConfirm.contact.name,
            command?.contactPhone || leadToConfirm.contact.phone,
            command?.contactEmail || leadToConfirm.contact.email
        )

        const tariff = this.createTariff(command.tariffType, command.organizationCountRange, command?.features)

        leadToConfirm.processed();

        await this.saveAllEntities(leadToConfirm, newCompany, ownerRole, newCompanyOwner, tariff);

        // await this.sendPasswordToEmail(originalPassword, leadToConfirm.contact.email);
    }

    private createCompany(companyName: LeadContactCompanyName, managerId: ManagerId) {
        return Company.create(
            managerId,
            CompanyName.of(companyName.toString())
        );
    }

    private createCompanyOwner(
        companyId: CompanyId,
        ownerRoleId: RoleId,
        hashedPassword: EmployeePassword,
        contactName: LeadContactName,
        contactPhone: LeadContactPhone,
        contactEmail: LeadContactEmail
    ) {
        return Employee.create(
            companyId,
            ownerRoleId,
            EmployeeName.of(contactName.toString()),
            EmployeeEmail.of(contactEmail.toString()),
            EmployeePhone.of(contactPhone.toString()),
            hashedPassword
        );
    }

    private createTariff(type: "BASIC" | "PRO" | "PRO+" | "CUSTOM", orgCountRange: OrganizationCountRange, features?: TariffFeatures): Tariff {
        console.log(type, "type")
        switch (type) {
            case "BASIC": return Tariff.createBasicTariff(orgCountRange);
            case "PRO": return Tariff.createProTariff(orgCountRange);
            case "PRO+": return Tariff.createProPlusTariff(orgCountRange);
            case "CUSTOM": return Tariff.createCustomTariff(orgCountRange, features!);
        }
    }

    private async saveAllEntities(
        lead: Lead,
        company: Company,
        companyOwnerRole: Role,
        companyOwner: Employee,
        tariff: Tariff
    ): Promise<void> {
        await this.uof.run(async (context) => {
            await context.leadRepo.save(lead);
            await context.companyRepo.save(company);
            await context.roleRepo.save(companyOwnerRole);
            await context.employeeRepo.save(companyOwner);
            await context.tariffRepo.save(tariff)
        });
    }

    private async generateOwnerPassword(): Promise<{ hashedPassword: EmployeePassword; originalPassword: EmployeePassword }> {
        const min = 10000000;
        const max = 99999999;
        const generatedStringPassword = `${Math.floor(Math.random() * (max - min + 1)) + min}`;
        const hashedPasswordString = await this.hashService.hash(generatedStringPassword);

        return {
            hashedPassword: new EmployeePassword(hashedPasswordString),
            originalPassword: new EmployeePassword(generatedStringPassword)
        };
    }

    private async sendPasswordToEmail(password: EmployeePassword, email: LeadContactEmail): Promise<void> {
        await this.taskService.addTask({
            queue: QUEUES.SEND_TO_EMAIL,
            jobId: `send_password_to_${email.toString()}`,
            attempts: 5,
            delay: 0,
            type: QUEUE_TYPE.DELAY,
            payload: {
                password: password.toString(),
                email: email.toString(),
            },
        });
    }
}
