import {ProxyPrefix} from "@application/use-case-proxies/proxy-prefix";
import {EmployeeOrmRepository} from "@infrastructure/repositories/employee/employee.repository";
import {ManagerOrmRepository} from "@infrastructure/repositories/manager/manager.repository";
import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {MeUseCase} from "@application/use-cases/default/auth/queries/me/me.usecase";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {BcryptService} from "@infrastructure/services/hash/bcrypt.service";
import {JwtTokenService} from "@infrastructure/services/jwt/jwt.service";
import {CacheRepository} from "@infrastructure/repositories/cache/cache.repository";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {IJwtService} from "@application/interfaces/services/jwt/jwt-service.interface";
import {ICacheRepository} from "@application/interfaces/services/cache/cache-repository.interface";
import {EmployeeLoginUseCase} from "@application/use-cases/default/auth/commands/login/login.usecase";
import {ManagerLoginUseCase} from "@application/use-cases/default/auth/commands/login-admin/login.usecase";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {IEmployeeQs} from "@application/interfaces/query-services/employee-qs/employee-qs.interface";
import {IManagerQs} from "@application/interfaces/query-services/manager-qs/manager-qs.interface";
import {EmployeeQueryService} from "@infrastructure/query-services/employee-query.service";
import {ManagerQueryService} from "@infrastructure/query-services/manager-query.service";

export const AuthProxy = {
    "ME_USE_CASE": `${ProxyPrefix.COMPANY_PROXY}UserMeUseCaseProxy`,
    "EMPLOYEE_LOGIN_USE_CASE": `${ProxyPrefix.USER_PROXY}EmployeeLoginUseCaseProxy`,
    "MANAGER_LOGIN_USE_CASE": `${ProxyPrefix.USER_PROXY}ManagerLoginUseCaseProxy`,
} as const;


export const authProxyProviders = [
    {
        inject: [EmployeeQueryService, ManagerQueryService],
        provide: AuthProxy.ME_USE_CASE,
        useFactory: (employeeQS: IEmployeeQs, managerQs: IManagerQs) => {
            return new UseCaseProxy(new MeUseCase(employeeQS, managerQs))
        }
    },

    {
        inject: [EmployeeOrmRepository, RoleOrmRepository, BcryptService, JwtTokenService, CacheRepository],
        provide: AuthProxy.EMPLOYEE_LOGIN_USE_CASE,
        useFactory: (employeeRepo: IEmployeeRepository, roleRepo: IRoleRepository, hashService: IHashService, jwtService: IJwtService, cacheRepo: ICacheRepository) => {
            return new UseCaseProxy(new EmployeeLoginUseCase(employeeRepo, roleRepo, hashService, jwtService, cacheRepo))
        }
    },
    {
        inject: [ManagerOrmRepository, RoleOrmRepository, BcryptService, JwtTokenService, CacheRepository],
        provide: AuthProxy.MANAGER_LOGIN_USE_CASE,
        useFactory: (managerRepo: IManagerRepository, roleRepo: IRoleRepository, hashService: IHashService, jwtService: IJwtService, cacheRepo: ICacheRepository) => {
            return new UseCaseProxy(new ManagerLoginUseCase(managerRepo, roleRepo, hashService, jwtService, cacheRepo))
        }
    },
]
export const authProxyExports = [
    AuthProxy.ME_USE_CASE,
    AuthProxy.EMPLOYEE_LOGIN_USE_CASE,
    AuthProxy.MANAGER_LOGIN_USE_CASE,
]
