import {BaseQuery} from "@application/common/base-query";
import {PaginationParams, SortParams} from "@application/interfaces/query-services/common/get-list.interface";
import {Actor} from "@domain/policy/actor";
import {GetEmployeeListFilterParams} from "@domain/employee/repositories/params/get-employee-list.params";
import {CompanyId} from "@domain/company/company";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";

export class GetEmployeeRolesQuery extends BaseQuery {
    constructor(
        public readonly companyId: CompanyId,
        actor: Actor,
    ) {super(actor)}

    static of(actor: Actor) {
        if (!actor?.companyId) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);
        return new GetEmployeeRolesQuery(
            actor.companyId,
            actor,
        );
    }
}
