import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {IJwtService, IJwtServicePayload} from "@application/interfaces/services/jwt/jwt-service.interface";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {Manager} from "@domain/manager/manager";
import {ManagerLoginCommand} from "@application/use-cases/default/manager/commands/login/login.command";
import {ManagerLoginOutput} from "@application/use-cases/default/manager/commands/login/login.output";

export class ManagerLoginUseCase {
    constructor(
        private readonly managerRepo: IManagerRepository,
        private readonly roleRepo: IRoleRepository,
        private readonly hashService: IHashService,
        private readonly jwtService: IJwtService,
        private readonly cacheRepo: ICacheRepository
    ) {}

    async execute(cmd: ManagerLoginCommand): Promise<ManagerLoginOutput> {
        const manager = await this.managerRepo.getByEmail(cmd.email);
        if (!manager) throw new Error(EXCEPTION.MANAGER.INCORRECT_EMAIL_OR_PASSWORD);

        const role = await this.roleRepo.getById(manager.roleId);
        if (!role) throw new Error(EXCEPTION.ROLE.NOT_FOUND);

        const passwordIsValid = await this.hashService.compare(cmd.password.toString(), manager.password.toString());
        if (!passwordIsValid) throw new Error(EXCEPTION.MANAGER.INCORRECT_EMAIL_OR_PASSWORD);

        await this.cacheRepo.setManagerAuth(manager, role);

        return new ManagerLoginOutput(
            manager,
            this.jwtService.generateUserToken(manager.id.toString()),
            this.jwtService.getJwtExpirationTime()
        )
    }
}
