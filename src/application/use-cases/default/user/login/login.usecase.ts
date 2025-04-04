import {IHashService} from "@application/services/hash/hash-service.interface";
import {LoginInput} from "@application/use-cases/default/user/login/login.input";
import {IJwtService, IJwtServicePayload} from "@application/services/jwt/jwt-service.interface";
import {ICacheRepository} from "@application/repositories/cache/cache-repository.interface";
import {IUserRepository} from "@domain/manager/repositories/manager-repository.interface";
import {Manager} from "@domain/manager/manager";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {LoginOutput} from "@application/use-cases/default/user/login/login.output";

export class UserLoginUseCase {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly hashService: IHashService,
        private readonly jwtService: IJwtService,
        private readonly cacheRepo: ICacheRepository
    ) {}

    async execute(input: LoginInput): Promise<LoginOutput> {
        const user = await this.userRepo.getByEmail(input.email);
        if (!user) throw new Error(EXCEPTION.USER.INCORRECT_EMAIL_OR_PASSWORD);

        const passwordIsValid = await this.hashService.compare(input.password, user.password.toString());
        if (!passwordIsValid) throw new Error(EXCEPTION.USER.INCORRECT_EMAIL_OR_PASSWORD);

        await this.cacheRepo.setUserAuthToken(user.id.toString(), user.permissions);

        return new LoginOutput(user, this.getToken(user), this.getTokenExpirationTime())
    }

    private getToken(user: Manager) {
        const secret = this.jwtService.getJwtSecret();
        const expiresIn = `${this.jwtService.getJwtRefreshExpirationTime()}s`;

        const payload: IJwtServicePayload = {
            authId: user.id.toString(),
            authPartnerId: user.partnerId?.toString() || null,
            authRole: user.role,
            ownerId: 0,
        };
        return this.jwtService.createToken(payload, secret, expiresIn);
    }

    private getTokenExpirationTime() {
        return this.jwtService.getJwtExpirationTime()
    }

}
