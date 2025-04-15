import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import {EmployeeOrmRepository} from '@infrastructure/repositories/employee/employee.repository';
import { UserLoginUseCase } from "@application/use-cases/default/employee/login/login.usecase";
import { IJwtService } from "@application/interfaces/services/jwt/jwt-service.interface";
import { IHashService } from "@application/interfaces/services/hash/hash-service.interface";
import { BcryptService } from "src/infrastructure/services/hash/bcrypt.service";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import { CacheRepository } from '@infrastructure/repositories/cache/cache.repository';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {MeUseCase} from "@application/use-cases/default/employee/me/me.usecase";

export const EmployeeProxy = {
    "LOGIN_USE_CASE": `${PREFIX.USER_PROXY}EmployeeLoginUseCaseProxy`,
    "ME_USE_CASE": `${PREFIX.USER_PROXY}EmployeeMeUseCaseProxy`
} as const;

export const employeeProxyProviders = [
    {
        inject: [EmployeeOrmRepository],
        provide: EmployeeProxy.ME_USE_CASE,
        useFactory: (employeeRepo: IEmployeeRepository) => {
            return new UseCaseProxy(new MeUseCase(employeeRepo))
        }
    },
    {
        inject: [EmployeeOrmRepository, BcryptService, JwtTokenService, CacheRepository],
        provide: EmployeeProxy.LOGIN_USE_CASE,
        useFactory: (employeeRepo: IEmployeeRepository, hashService: IHashService, jwtService: IJwtService, cacheRepo: ICacheRepository) => {
            return new UseCaseProxy(new UserLoginUseCase(employeeRepo, hashService, jwtService, cacheRepo))
        }
    },

]
export const employeeProxyExports = [
    EmployeeProxy.LOGIN_USE_CASE,
    EmployeeProxy.ME_USE_CASE,
]
