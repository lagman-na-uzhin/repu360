import {Actor} from "@application/common/actor";

export class BaseManagerCommand {
    constructor(
        public readonly actor: Actor
    ) {}
}
