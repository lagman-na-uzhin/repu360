import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";
import {CompanyId} from "@domain/company/company";

export class GetOrganizationListQuery extends BaseQuery {
    constructor(
        public readonly filter: {
            readonly companyId: CompanyId,
            readonly isActive?: boolean,
            readonly isTemporarilyClosed?: boolean,
        },
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {super(actor)}

    static of(dto: {
        filter: {
            companyId: CompanyId,
            isActive?: boolean,
            isTemporarilyClosed?: boolean,
        },
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

