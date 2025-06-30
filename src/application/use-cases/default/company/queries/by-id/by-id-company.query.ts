import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";
import {CompanyId} from "@domain/company/company";

export class ByIdCompanyQuery extends BaseQuery {
    constructor(
        public readonly companyId: CompanyId,
        public readonly actor: Actor,
    ) {super(actor)}

    static of(dto: { companyId: CompanyId }, actor: Actor) {
        return new ByIdCompanyQuery(
            dto.companyId,
            actor
        );
    }

}

