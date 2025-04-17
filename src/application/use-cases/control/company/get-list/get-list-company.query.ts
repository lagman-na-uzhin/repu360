import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@domain/common/interfaces/repositories/get-list.interface";
import {GetCompanyListFilter} from "@domain/company/repositories/types/get-company-list.params";
import {Actor} from "@domain/policy/actor";

export class GetListCompanyQuery extends BaseQuery {
    private constructor(
        public readonly filter: GetCompanyListFilter,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {
        super(actor);
    }

    static of(
        filter: GetCompanyListFilter,
        pagination: PaginationParams,
        actor: Actor,
        sort?: SortParams,
        search?: string,
    ) {
        return new GetListCompanyQuery(
            filter,
            pagination,
            actor,
            sort,
            search
        )
    }
}
