import {Employee} from "@domain/employee/employee";
import {EmployeePassword} from "@domain/employee/value-object/employee-password.vo";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IHashService} from '@application/interfaces/services/hash/hash-service.interface';
import {ITaskService} from '@application/interfaces/services/task/task-service.interface';
import {SetOwnerCommand} from "@application/use-cases/control/employee/set-owner/set-owner.command";
import {Role, RoleId} from "@domain/policy/model/role";
import {EmployeePermissions} from "@domain/policy/model/employee-permissions";
import {RoleType} from "@domain/policy/value-object/role/type.vo";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";

export class SetOwnerUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly hashService: IHashService,
        private readonly taskService: ITaskService,
        private readonly roleRepo: IRoleRepository,
        private readonly uow: IUnitOfWork
    ) {}

    async execute(cmd: SetOwnerCommand): Promise<void> {
        const permissions = EmployeePermissions.owner();

        const role = Role.create(new RoleType("OWNER"), permissions);

        const {originalPassword, hashedPassword} = await this.generatePassword()

        const owner = Employee.create(
            cmd.companyId,
            role.id,
            cmd.ownerName,
            cmd.ownerEmail,
            cmd.ownerPhone,
            hashedPassword
        )

        await this.uow.run(async (uow) => {
            await uow.roleRepo.save(role);
            await uow.employeeRepo.save(owner);
        })

        await this.initSendPasswordToEmailTask(originalPassword);
    }

    private async generatePassword(): Promise<{ hashedPassword: EmployeePassword; originalPassword: EmployeePassword }> {
        const originalPassword = `${Math.floor(Math.random() * (99999999 - 10000000) + 10000000)}`;
        const hashedPassword = await this.hashService.hash(originalPassword);
        return {
            hashedPassword: new EmployeePassword(hashedPassword),
            originalPassword: new EmployeePassword(originalPassword)
        };
    }

    private async initSendPasswordToEmailTask(originalPassword: EmployeePassword): Promise<void> {
        // await this.taskService.addTask({
        //     type: 'sendPasswordToEmail',
        //     data: { email: originalPassword }
        // });
    }
}
