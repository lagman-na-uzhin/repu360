import { Injectable } from "@nestjs/common";
import {EntityManager, Equal} from "typeorm";
import { IEmployeeRepository } from "@domain/employee/repositories/employee-repository.interface";
import {EmployeeEmail} from "@domain/employee/value-object/employee-email.vo";
import {Employee, EmployeeId} from "@domain/employee/employee";
import {UserEntity} from "@infrastructure/entities/user/user.entity";
import {EmployeePhone} from "@domain/employee/value-object/employee-phone.vo";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Company, CompanyId} from "@domain/company/company";
import {RoleId} from "@domain/policy/model/role";
import {IManagerRepository} from "@domain/manager/repositories/manager-repository.interface";
import {Manager, ManagerId} from "@domain/manager/manager";
import {ManagerEmail} from "@domain/manager/value-object/manager-email.vo";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {CompanyEntity} from "@infrastructure/entities/company/company.entity";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {Lead, LeadId} from "@domain/lead/lead";
import {GetLeadListParams} from "@domain/lead/repositories/params/get-lead-list.params";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {LeadEntity} from "@infrastructure/entities/lead/lead.entity";
import {LeadContactEntity} from "@infrastructure/entities/lead/lead-contact.entity";
import {LeadContact} from "@domain/lead/model/lead-contact";
import {LeadContactEmail} from "@domain/manager/value-object/lead/lead-contact-email.vo";

@Injectable()
export class LeadOrmRepository implements ILeadRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        private readonly base: BaseRepository<LeadEntity>
    ) {}

    async getById(id: LeadId): Promise<Lead | null> {
        const entity = await this.manager.getRepository(LeadEntity).findOneBy({id: Equal(id.toString())});
        return entity ? this.toDomain(entity) : null;
    }

    async getList(params: GetLeadListParams): Promise<PaginatedResult<Lead>> {
        const { filter } = params;

        const qb = this.manager.getRepository(LeadEntity).createQueryBuilder('lead');

        if (filter?.status) {
        }

        return this.base.getList<Lead>(qb, this.toDomain, params.pagination,  params.sort);
    }

    async save(lead: Lead): Promise<void> {
        await this.manager.getRepository(LeadEntity).save(this.fromDomain(lead));
    }

    private toDomain(entity: LeadEntity): Lead {
        const contact = this.toContactDomain(entity.contact);
        return Lead.fromPersistence(entity.id, contact, entity.managerId, entity.processedAt, entity.createdAt);
    }
    private fromDomain(lead: Lead): LeadEntity {
        const contactPersistence = this.fromContactDomain(lead.id, lead.contact);

        const entity = new LeadEntity();
        entity.id = lead.id.toString();
        entity.managerId = lead.managerId?.toString() || null;
        entity.contact = contactPersistence;
        entity.processedAt = lead.processedAt;
        entity.createdAt = lead.createdAt;

        return entity;
    }

    private fromContactDomain(leadId: LeadId, contact: LeadContact): LeadContactEntity {
        const entity = new LeadContactEntity();

        entity.leadId = leadId.toString();
        entity.name = contact.name.toString();
        entity.email = contact.email.toString();
        entity.phone = contact.phone.toString();

        return entity;
    }


    private toContactDomain(entity: LeadContactEntity): LeadContact {
        return LeadContact.fromPersistence(entity.phone, entity.name, entity.email);
    }
}
