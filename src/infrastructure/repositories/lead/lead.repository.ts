import { Injectable } from "@nestjs/common";
import {EntityManager, Equal} from "typeorm";
import {InjectEntityManager} from "@nestjs/typeorm";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {Lead, LeadId} from "@domain/lead/lead";
import {LeadEntity} from "@infrastructure/entities/lead/lead.entity";
import {LeadContactEntity} from "@infrastructure/entities/lead/lead-contact.entity";
import {LeadContact} from "@domain/lead/model/lead-contact";

@Injectable()
export class LeadOrmRepository implements ILeadRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getById(id: LeadId): Promise<Lead | null> {
        const entity = await this.manager.getRepository(LeadEntity).findOneBy({id: Equal(id.toString())});
        return entity ? this.toDomain(entity) : null;
    }

    async save(lead: Lead): Promise<void> {
        await this.manager.getRepository(LeadEntity).save(this.fromDomain(lead));
    }

    private toDomain(entity: LeadEntity): Lead {
        console.log(entity, "ebrrr")
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
        entity.companyName = contact.companyName.toString();
        entity.name = contact.name.toString();
        entity.email = contact.email.toString();
        entity.phone = contact.phone.toString();

        return entity;
    }


    private toContactDomain(entity: LeadContactEntity): LeadContact {
        return LeadContact.fromPersistence(entity.companyName, entity.phone, entity.name, entity.email);
    }
}
