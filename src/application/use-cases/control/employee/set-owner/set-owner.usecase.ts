import {Employee} from "@domain/employee/employee";
import {EmployeeRole} from "@domain/employee/model/employee-role";
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";
import {EmployeeType} from "@domain/employee/value-object/employee-role/employee-type.vo";
import {EmployeePermissions} from "@domain/employee/model/employee-permissions";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";

import {IHashService} from '@application/interfaces/services/hash/hash-service.interface';
import {ITaskService} from '@application/interfaces/services/task/task-service.interface';
import {SetOwnerInput} from "@application/use-cases/control/employee/set-owner/set-owner.input";


export class SetOwnerUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService
    ) {}

    async execute(input: SetOwnerInput): Promise<void> {
        const {originalPassword, hashedPassword} = await this.generatePassword()

        const role = this.createOwnerRole();

        const owner = Employee.create(
            input.companyId,
            role,
            input.ownerName,
            input.ownerEmail,
            input.ownerPhone,
            new EmployeePassword(hashedPassword)
        )

        await this.employeeRepo.save(owner);

        await this.initSendPasswordToEmailTask(originalPassword);
    }


    private createOwnerRole(): EmployeeRole {
        const permissions = EmployeePermissions.owner();
        return EmployeeRole.create(new EmployeeType("OWNER"), permissions);
    }

    private async generatePassword(): Promise<{ hashedPassword: string; originalPassword: string }> {
        const originalPassword = `${Math.floor(Math.random() * (99999999 - 10000000) + 10000000)}`;
        const hashedPassword = await this.hashService.hash(originalPassword);
        return {hashedPassword, originalPassword};
    }

    private async initSendPasswordToEmailTask(originalPassword: string): Promise<void> {
        // await this.taskService.addTask({
        //     type: 'sendPasswordToEmail',
        //     data: { email: originalPassword }
        // });
    }
}
