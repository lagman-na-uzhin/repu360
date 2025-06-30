import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ByIdManagerUseCase} from "@application/use-cases/default/manager/queries/by-id-manager.usecase";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {ManagerProxy} from "@application/use-case-proxies/manager/manager.proxy";
import {ManagerOrmRepository} from "@infrastructure/repositories/manager/manager.repository";

export const managerProxyProviders = [
    {
        inject: [ManagerOrmRepository],
        provide: ManagerProxy.BY_ID,
        useFactory: (managerRepo: IManagerRepository) => {return new UseCaseProxy(new ByIdManagerUseCase(managerRepo))}
    },
]
