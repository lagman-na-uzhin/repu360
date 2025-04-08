import {Lead} from "@domain/manager/model/lead/lead";

export interface ILeadRepository {
    getById(id: string): Promise<Lead | null>
}
