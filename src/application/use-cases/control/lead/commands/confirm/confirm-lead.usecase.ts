import { ConfirmLeadCommand } from "@application/use-cases/control/lead/commands/confirm/confirm-lead.command";
import { ILeadRepository } from "@domain/lead/repositories/lead-repository.interface";
import { EXCEPTION } from "@domain/common/exceptions/exceptions.const";
import { Company } from "@domain/company/company";
import { IUnitOfWork } from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import { Employee } from "@domain/employee/employee";
import { Role } from "@domain/policy/model/role";
import { Lead } from "@domain/lead/lead";
import { EmployeePassword } from "@domain/employee/value-object/employee-password.vo";
import { IHashService } from "@application/interfaces/services/hash/hash-service.interface";
import { ITaskService, QUEUE_TYPE, QUEUES } from "@application/interfaces/services/task/task-service.interface";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";
import {EmployeeName} from "@domain/employee/value-object/employee-name.vo";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {CompanyName} from "@domain/company/value-object/company-name.vo";

export class ConfirmLeadUseCase {
    constructor(
        private readonly leadRepository: ILeadRepository,
        private readonly uof: IUnitOfWork,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService
    ) {}

    async execute(command: ConfirmLeadCommand): Promise<void> {
        const leadToConfirm = await this.leadRepository.getById(command.leadId);
        if (!leadToConfirm) {
            throw new Error(EXCEPTION.LEAD.NOT_FOUND);
        }
        const newCompany = Company.create(
            command.actor.id,
            CompanyName.of(leadToConfirm.contact.companyName.toString())
            );

        const companyOwnerRole = Role.createCompanyOwnerRole();

        const { originalPassword, hashedPassword } = await this.generateOwnerPassword();

        const newCompanyOwner = Employee.create(
            newCompany.id,
            companyOwnerRole.id,
            EmployeeName.of(leadToConfirm.contact.name.toString()),
            EmployeeEmail.of(leadToConfirm.contact.email.toString()),
            EmployeePhone.of(leadToConfirm.contact.phone.toString()),
            hashedPassword
        );

        leadToConfirm.processed();

        await this.saveAllEntities(leadToConfirm, newCompany, companyOwnerRole, newCompanyOwner);

        await this.sendPasswordToEmail(originalPassword, leadToConfirm.contact.email);
    }

    private async saveAllEntities(
        lead: Lead,
        company: Company,
        companyOwnerRole: Role,
        companyOwner: Employee
    ): Promise<void> {
        await this.uof.run(async (context) => {
            await context.leadRepo.save(lead);
            await context.companyRepo.save(company);
            await context.roleRepo.save(companyOwnerRole);
            await context.employeeRepo.save(companyOwner);
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
            queue: QUEUES.SEND_TO_RMAIL,
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
