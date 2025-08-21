import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {EmployeeLoginCommand} from "@application/use-cases/default/auth/commands/login/login.command";
import {IJwtService, IJwtServicePayload} from "@application/interfaces/services/jwt/jwt-service.interface";
import {ICacheRepository} from "@application/interfaces/services/cache/cache-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {LoginOutput} from "@application/use-cases/default/auth/commands/login/login.output";
import {Employee} from "@domain/employee/employee";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";

export class EmployeeLoginUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly roleRepo: IRoleRepository,
        private readonly hashService: IHashService,
        private readonly jwtService: IJwtService,
        private readonly cacheRepo: ICacheRepository
    ) {}

    async execute(cmd: EmployeeLoginCommand): Promise<{ token: string, expire: string }> {
        const employee = await this.employeeRepo.getByEmail(cmd.email);
        if (!employee) throw new Error(EXCEPTION.EMPLOYEE.INCORRECT_EMAIL_OR_PASSWORD);

        const role = await this.roleRepo.getById(employee.roleId);
        if (!role) throw new Error(EXCEPTION.ROLE.NOT_FOUND);

        const passwordIsValid = await this.hashService.compare(cmd.password.toString(), employee.password.toString());
        if (!passwordIsValid) throw new Error(EXCEPTION.EMPLOYEE.INCORRECT_EMAIL_OR_PASSWORD);

        console.log(employee, "employee")
        console.log(role, "roleee")
        await this.cacheRepo.setEmployeeAuth(employee, role);

        return {
            token: this.jwtService.generateUserToken(employee.id.toString()),
            expire: this.jwtService.getJwtExpirationTime()
        }
    }
}
