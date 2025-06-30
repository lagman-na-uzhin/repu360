import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";
import {ManagerId} from "@domain/manager/manager";

export class ByIdManagerQuery extends BaseQuery {
    constructor(
        public readonly managerId: ManagerId,
        actor: Actor,
    ) {super(actor)}

    static of(
        dto: { managerId: ManagerId},
        actor: Actor
    ) {
        return new ByIdManagerQuery(
            dto.managerId,
            actor,
        );
    }
}

