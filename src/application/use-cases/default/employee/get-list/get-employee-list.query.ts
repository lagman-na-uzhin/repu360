import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";
import {Actor} from "@domain/policy/actor";
import {GetEmployeeListFilterParams} from "@domain/employee/repositories/params/get-employee-list.params";

export class GetListEmployeeQuery extends BaseQuery {
    constructor(
        public readonly filter: GetEmployeeListFilterParams,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {super(actor)}

    static of(dto: {
                  filter: GetEmployeeListFilterParams,
                  pagination: PaginationParams,
                  sort?: SortParams,
                  search?: string
              }, actor: Actor
    ) {
        return new GetListEmployeeQuery(
            dto.filter,
            dto.pagination,
            actor,
            dto.sort,
            dto.search
        );
    }
}
