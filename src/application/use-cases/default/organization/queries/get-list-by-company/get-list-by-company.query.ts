import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@domain/common/interfaces/repositories/get-list.interface";
import {GetOrganizationListByCompanyFilter} from "@domain/organization/repositories/params/get-list-by-company.params";
import {CompanyId} from "@domain/company/company";

export class GetOrganizationListQuery extends BaseQuery {
    constructor(
        public readonly filter: GetOrganizationListByCompanyFilter,
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {super(actor)}

    static of(
        {companyId, pagination, sort, search}:
        {companyId: CompanyId, pagination: PaginationParams, sort?: SortParams, search?: string},
        actor: Actor) {

        const filter: GetOrganizationListByCompanyFilter = {companyId}
        return new GetOrganizationListQuery(
            filter,
            pagination,
            actor,
            sort,
            search
        );
    }
}

