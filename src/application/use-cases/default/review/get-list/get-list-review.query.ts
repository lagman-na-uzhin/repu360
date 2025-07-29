import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";
import {Actor} from "@domain/policy/actor";
import {GetReviewListFilterParams} from "@domain/review/repositories/params/get-list.params";

export class GetListReviewQuery extends BaseQuery {
    constructor(
        public readonly filter: GetReviewListFilterParams,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {super(actor)}

    static of(dto: {
                  filter: GetReviewListFilterParams,
                  pagination: PaginationParams,
                  sort?: SortParams,
                  search?: string
              }, actor: Actor
    ) {
        return new GetListReviewQuery(
            dto.filter,
            dto.pagination,
            actor,
            dto.sort,
            dto.search
        );
    }
}
