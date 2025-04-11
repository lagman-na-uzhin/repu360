import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {LoginInput} from "@application/use-cases/default/employee/login/login.input";
import {IJwtService, IJwtServicePayload} from "@application/interfaces/services/jwt/jwt-service.interface";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {LoginOutput} from "@application/use-cases/default/employee/login/login.output";
import {Employee} from "@domain/employee/employee";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";

export class UserLoginUseCase {
    constructor(
        private readonly employeeRepo: IEmployeeRepository,
        private readonly hashService: IHashService,
        private readonly jwtService: IJwtService,
        private readonly cacheRepo: ICacheRepository
    ) {}

    async execute(input: LoginInput): Promise<LoginOutput> {
        const employee = await this.employeeRepo.getByEmail(input.email);
        if (!employee) throw new Error(EXCEPTION.EMPLOYEE.INCORRECT_EMAIL_OR_PASSWORD);

        const passwordIsValid = await this.hashService.compare(input.password.toString(), employee.password.toString());
        if (!passwordIsValid) throw new Error(EXCEPTION.EMPLOYEE.INCORRECT_EMAIL_OR_PASSWORD);

        await this.cacheRepo.setUserAuthToken(employee.id.toString(), employee.role);

        return new LoginOutput(employee, this.getToken(employee), this.getTokenExpirationTime())
    }

    private getToken(employee: Employee) {
        const secret = this.jwtService.getJwtSecret();
        const expiresIn = `${this.jwtService.getJwtRefreshExpirationTime()}s`;

        const payload: IJwtServicePayload = {authId: employee.id.toString()};
        return this.jwtService.createToken(payload, secret, expiresIn);
    }

    private getTokenExpirationTime() {
        return this.jwtService.getJwtExpirationTime()
    }

}
