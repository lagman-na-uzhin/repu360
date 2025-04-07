import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UserOrmRepository } from 'src/infrastructure/repositories/user/user.repository';
import { UserLoginUseCase } from "@application/use-cases/default/employee/login/login.usecase";
import { IJwtService } from "src/application/services/jwt/jwt-service.interface";
import { IHashService } from "src/application/services/hash/hash-service.interface";
import { BcryptService } from "src/infrastructure/services/hash/bcrypt.service";
import {ICacheRepository} from "src/application/repositories/cache/cache-repository.interface";
import {IUserRepository} from "@domain/manager/repositories/manager-repository.interface";
import {UserMeUseCase} from "@application/use-cases/default/employee/me/me.usecase";
import { CacheRepository } from '@infrastructure/repositories/cache/cache.repository';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';

export const UserProxy = {
    "LOGIN_USE_CASE": `${PREFIX.USER_PROXY}UserLoginUseCaseProxy`,
    "ME_USE_CASE": `${PREFIX.USER_PROXY}UserMeUseCaseProxy`
} as const;

export const userProxyProviders = [
    {
        inject: [UserOrmRepository],
        provide: UserProxy.ME_USE_CASE,
        useFactory: (userRepo: IUserRepository) => {
            return new UseCaseProxy(new UserMeUseCase(userRepo))
        }
    },
    {
        inject: [UserOrmRepository, BcryptService, JwtTokenService, CacheRepository],
        provide: UserProxy.LOGIN_USE_CASE,
        useFactory: (userRepo: IUserRepository, hashService: IHashService, jwtService: IJwtService, cacheRepo: ICacheRepository) => {
            return new UseCaseProxy(new UserLoginUseCase(userRepo, hashService, jwtService, cacheRepo))
        }
    },

]
export const userProxyExports = [
    UserProxy.LOGIN_USE_CASE,
    UserProxy.ME_USE_CASE,
]
