import {Actor} from "@domain/policy/actor";

export class BaseQuery {
    constructor(
        public readonly actor: Actor,
    ) {}
}
