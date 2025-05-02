import { DataSource, EntityManager } from 'typeorm';
import {IUnitOfWork, IUnitOfWorkContext} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {EmployeeOrmRepository} from "@infrastructure/repositories/employee/employee.repository";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {Injectable} from "@nestjs/common";
import {ReviewOrmRepository} from "@infrastructure/repositories/review/review.repository";
import {ProfileOrmRepository} from "@infrastructure/repositories/profile/profile.repository";



@Injectable()
export class UnitOfWork implements IUnitOfWork {
    constructor(private readonly dataSource: DataSource) {}

    async run<T>(work: (ctx: IUnitOfWorkContext) => Promise<T>): Promise<T> {
        return this.dataSource.transaction(async (manager: EntityManager) => {
            const ctx: IUnitOfWorkContext = {
                employeeRepo: new EmployeeOrmRepository(manager),
                roleRepo: new RoleOrmRepository(manager),
                reviewRepo: new ReviewOrmRepository(manager),
                profileRepo: new ProfileOrmRepository(manager)
            };

            return await work(ctx);
        });
    }
}

