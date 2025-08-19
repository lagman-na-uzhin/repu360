import {BaseQuery} from "@application/common/base-query";
import {CompanyId} from "@domain/company/company";
import {Actor} from "@domain/policy/actor";

export class GetSummaryQuery extends BaseQuery {
    constructor(
        readonly companyId: CompanyId,
        actor: Actor,
    ) {super(actor)}

    static of(dto: {companyId: CompanyId}, actor: Actor) {
        return new GetSummaryQuery(dto.companyId, actor);
    }
}

