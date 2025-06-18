import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {CreateLeadUseCase} from "@application/use-cases/default/lead/commands/create/create-lead.usecase";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {LeadOrmRepository} from "@infrastructure/repositories/lead/lead.repository";
import {LeadProxy} from "@application/use-case-proxies/lead/lead.proxy";
import {
    AssignManagerLeadUseCase
} from "@application/use-cases/control/lead/commands/assign-manager/assign-manager-lead.usecase";
import {ConfirmLeadUseCase} from "@application/use-cases/control/lead/commands/confirm/confirm-lead.usecase";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";
import {ITaskService} from "@application/interfaces/services/task/task-service.interface";
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";
import {BcryptService} from "@infrastructure/services/hash/bcrypt.service";
import {BullService} from "@infrastructure/services/bull/bull.service";

export const leadProxyProviders = [
    {
        inject: [LeadOrmRepository],
        provide: LeadProxy.CREATE_LEAD_USE_CASE,
        useFactory: (
            leadRepo: ILeadRepository,
        ) => {
            return new UseCaseProxy(new CreateLeadUseCase(
                leadRepo
            ))
        }
    },

    {
        inject: [LeadOrmRepository],
        provide: LeadProxy.ASSIGN_MANAGER_USE_CASE,
        useFactory: (
            leadRepo: ILeadRepository,
        ) => {
            return new UseCaseProxy(new AssignManagerLeadUseCase(
                leadRepo
            ))
        }
    },

    {
        inject: [LeadOrmRepository, UnitOfWork, BcryptService, BullService],
        provide: LeadProxy.CONFIRM_LEAD_USE_CASE,
        useFactory: (
            leadRepo: ILeadRepository,
            uof: IUnitOfWork,
            hashService: IHashService,
            taskService: ITaskService
        ) => {
            return new UseCaseProxy(new ConfirmLeadUseCase(
                leadRepo,
                uof,
                hashService,
                taskService
            ))
        }
    },
]
