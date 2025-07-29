import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";
import {GetLeadListFilter} from "@domain/lead/repositories/params/get-lead-list.params";

export class GetLeadListQuery extends BaseQuery {
    private constructor(
        public readonly filter: GetLeadListFilter,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {
        super(actor);
    }

    static of(
        dto: {
            filter: GetLeadListFilter,
            pagination: PaginationParams,
            sort?: SortParams,
            search?: string,
        },
        actor: Actor,
    ) {
        return new GetLeadListQuery(
            dto.filter,
            dto.pagination,
            actor,
            dto.sort,
            dto.search
        )
    }
}

