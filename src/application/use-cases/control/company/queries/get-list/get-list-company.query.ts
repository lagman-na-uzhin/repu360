import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@domain/common/repositories/get-list.interface";
import {GetCompanyListFilterParams} from "@domain/company/repositories/types/get-company-list.params";
import {Actor} from "@domain/policy/actor";

export class GetListCompanyQuery extends BaseQuery {
    private constructor(
        public readonly filter: GetCompanyListFilterParams,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {
        super(actor);
    }

    static of(
        dto: {
            filter: GetCompanyListFilterParams,
            pagination: PaginationParams,
            sort?: SortParams,
            search?: string,
        },
        actor: Actor,
    ) {
        return new GetListCompanyQuery(
            dto.filter,
            dto.pagination,
            actor,
            dto.sort,
            dto.search
        )
    }
}
