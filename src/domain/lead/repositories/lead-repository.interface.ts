import {Lead, LeadId} from "@domain/lead/lead";

export interface ILeadRepository {
    getById(id: LeadId): Promise<Lead | null>;
    save(lead: Lead): Promise<void>;
}
