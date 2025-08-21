import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";
import {Actor} from "@domain/policy/actor";
import {CompanyId} from "@domain/company/company";
import {GroupId} from "@domain/organization/group";
import {OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class GetListReviewQuery extends BaseQuery {
    constructor(
        public readonly filter: {
            readonly companyId: CompanyId;
            readonly groupIds: GroupId[];
            readonly organizationIds?: OrganizationId[];
            readonly cities: string[];
            readonly tone?: 'positive' | 'negative';
            readonly platform?: PLATFORMS
        },
        public readonly pagination: PaginationParams,
        actor: Actor,
        public readonly sort?: SortParams,
        public readonly search?: string,
    ) {super(actor)}

    static of(dto: {
                  filter: {
                      readonly groupIds: GroupId[];
                      readonly organizationIds?: OrganizationId[];
                      readonly cities: string[];
                      readonly tone?: 'positive' | 'negative';
                      readonly platform?: PLATFORMS
                  },
                  pagination: PaginationParams,
                  sort?: SortParams,
                  search?: string
              }, actor: Actor
    ) {
        if (!actor.companyId) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);
        return new GetListReviewQuery(
            {...dto.filter, companyId: actor.companyId},
            dto.pagination,
            actor,
            dto.sort,
            dto.search
        );
    }
}
