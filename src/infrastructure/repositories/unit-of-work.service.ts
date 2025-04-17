// unit-of-work.ts
import { EntityManager, getManager } from 'typeorm';
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";

export class UnitOfWork implements IUnitOfWork {
    private manager: EntityManager;
    employeeRepo: Employee;

    constructor() {
        this.manager = getManager();
        this.userRepository = this.manager.getCustomRepository(UserRepository);
    }

    async executeTransaction<T>(callback: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
        return await this.manager.transaction(async (transactionalEntityManager) => {
            this.manager = transactionalEntityManager;
            this.userRepository = this.manager.getCustomRepository(UserRepository);
            return await callback(this);
        });
    }

    getUserRepository(): IUserRepository {
        return this.userRepository;
    }
}
