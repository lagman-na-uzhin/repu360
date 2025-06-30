import {ByIdManagerQuery} from "@application/use-cases/default/manager/queries/by-id-manager.query";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class ByIdManagerUseCase {
    constructor(
        private readonly managerRepo: IManagerRepository
    ) {}

    async execute(query: ByIdManagerQuery) {
        const manager = await this.managerRepo.getById(query.managerId);
        if (!manager) throw new Error(EXCEPTION.MANAGER.NOT_FOUND);

        return manager;
    }
}
