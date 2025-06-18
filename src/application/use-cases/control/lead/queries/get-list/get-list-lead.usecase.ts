import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {GetLeadListQuery} from "@application/use-cases/control/lead/queries/get-list/get-list-lead.query";
import {Lead} from "@domain/lead/lead";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";

export class GetListLeadUseCase {
    constructor(
        private readonly leadRepo: ILeadRepository
    ) {}

    async execute(qy: GetLeadListQuery): Promise<PaginatedResult<Lead>> {
        return this.leadRepo.getLeadList(qy);
    }

}

