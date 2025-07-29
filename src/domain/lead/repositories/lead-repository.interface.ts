import {Lead, LeadId} from "@domain/lead/lead";
import {GetLeadListParams} from "@domain/lead/repositories/params/get-lead-list.params";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";

export interface ILeadRepository {
    getById(id: LeadId): Promise<Lead | null>;
    save(lead: Lead): Promise<void>;
    getLeadList(params: GetLeadListParams): Promise<PaginatedResult<Lead>>
}
