import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query/base-query";

export class EmployeeMeQuery extends BaseQuery {
    private constructor(
        actor: Actor
    ) {super(actor);}

    static of(actor: Actor) {
        return new EmployeeMeQuery(actor);
    }
}
