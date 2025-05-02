import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import {EmployeeOrmRepository} from '@infrastructure/repositories/employee/employee.repository';
import { EmployeeLoginUseCase } from "@application/use-cases/default/employee/login/login.usecase";
import { IJwtService } from "@application/interfaces/services/jwt/jwt-service.interface";
import { IHashService } from "@application/interfaces/services/hash/hash-service.interface";
import { BcryptService } from "src/infrastructure/services/hash/bcrypt.service";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import { CacheRepository } from '@infrastructure/repositories/cache/cache.repository';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {ManagerLoginUseCase} from "@application/use-cases/default/manager/login/login.usecase";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {ManagerOrmRepository} from "@infrastructure/repositories/manager/manager.repository";

export const ManagerProxy = {
    "LOGIN_USE_CASE": `${PREFIX.USER_PROXY}ManagerLoginUseCaseProxy`,
    // "ME_USE_CASE": `${PREFIX.USER_PROXY}ManagerMeUseCaseProxy`
} as const;

export const managerProxyProviders = [
    // {
    //     inject: [EmployeeOrmRepository],
    //     provide: ManagerProxy.ME_USE_CASE,
    //     useFactory: (employeeRepo: IEmployeeRepository) => {
    //         return new UseCaseProxy(new MeUseCase(employeeRepo))
    //     }
    // },
    {
        inject: [ManagerOrmRepository, RoleOrmRepository, BcryptService, JwtTokenService, CacheRepository],
        provide: ManagerProxy.LOGIN_USE_CASE,
        useFactory: (managerRepo: IManagerRepository, roleRepo: IRoleRepository, hashService: IHashService, jwtService: IJwtService, cacheRepo: ICacheRepository) => {
            return new UseCaseProxy(new ManagerLoginUseCase(managerRepo, roleRepo, hashService, jwtService, cacheRepo))
        }
    },

]
export const managerProxyExports = [
    ManagerProxy.LOGIN_USE_CASE,
    // ManagerProxy.ME_USE_CASE,
]
