import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@domain/common/repositories/get-list.interface";
import {GetOrganizationListByCompanyFilter} from "@domain/organization/repositories/params/get-list-by-company.params";

export class GetOrganizationListQuery extends BaseQuery {
    constructor(
        public readonly filter: GetOrganizationListByCompanyFilter,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {super(actor)}

    static of(dto: {
        filter: GetOrganizationListByCompanyFilter,
        pagination: PaginationParams,
        sort?: SortParams,
        search?: string
    }, actor: Actor
    ) {
        console.log(dto, "dtooooo")
        return new GetOrganizationListQuery(
            dto.filter,
            dto.pagination,
            actor,
            dto.sort,
            dto.search
        );
    }
}

