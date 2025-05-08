import {Actor} from "@domain/policy/actor";
import {BaseQuery} from "@application/common/base-query";

export class UserMeQuery extends BaseQuery {
    private constructor(
        actor: Actor
    ) {super(actor);}

    static of(actor: Actor) {
        return new UserMeQuery(actor);
    }
}
