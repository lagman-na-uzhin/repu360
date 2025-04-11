import {Lead, LeadId} from "@domain/manager/model/lead/lead";

export interface ILeadRepository {
    getById(id: LeadId): Promise<Lead | null>
}
