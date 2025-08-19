import {BaseQuery} from "@application/common/base-query";
import {CompanyId} from "@domain/company/company";
import {Actor} from "@domain/policy/actor";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class GetCompactOrganizationQuery extends BaseQuery {
    constructor(
        readonly companyId: CompanyId,
        actor: Actor,
    ) {super(actor)}

    static of(actor: Actor) {
        if (!actor?.companyId) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);
        return new GetCompactOrganizationQuery(actor.companyId, actor);
    }
}

