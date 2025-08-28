import { DataSource, EntityManager } from 'typeorm';
import {IUnitOfWork, IUnitOfWorkContext} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {EmployeeOrmRepository} from "@infrastructure/repositories/employee/employee.repository";
import {RoleOrmRepository} from "@infrastructure/repositories/role/role.repository";
import {Injectable} from "@nestjs/common";
import {ReviewOrmRepository} from "@infrastructure/repositories/review/review.repository";
import {ProfileOrmRepository} from "@infrastructure/repositories/profile/profile.repository";
import {LeadOrmRepository} from "@infrastructure/repositories/lead/lead.repository";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {TariffOrmRepository} from "@infrastructure/repositories/subscription/tariff.repository";
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {OrganizationOrmRepository} from "@infrastructure/repositories/organization/organization.repository";
import {RubricOrmRepository} from "@infrastructure/repositories/rubric/rubric-repository";



@Injectable()
export class UnitOfWork implements IUnitOfWork {
    constructor(
        private readonly dataSource: DataSource,
    ) {}

    async run<T>(work: (ctx: IUnitOfWorkContext) => Promise<T>): Promise<T> {
        return this.dataSource.transaction(async (manager: EntityManager) => {
            const ctx: IUnitOfWorkContext = {
                roleRepo: new RoleOrmRepository(manager),
                employeeRepo: new EmployeeOrmRepository(manager),
                reviewRepo: new ReviewOrmRepository(manager),
                profileRepo: new ProfileOrmRepository(manager),
                leadRepo: new LeadOrmRepository(manager),
                companyRepo: new CompanyOrmRepository(manager),
                tariffRepo: new TariffOrmRepository(manager),
                placementRepo: new PlacementOrmRepository(manager),
                organizationRepo: new OrganizationOrmRepository(manager),
                rubricRepo: new RubricOrmRepository(manager)

            };

            return await work(ctx);
        });
    }
}

