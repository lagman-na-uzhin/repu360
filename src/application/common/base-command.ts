import {Actor} from "@domain/policy/actor";

export class BaseCommand {
    constructor(
        public readonly actor: Actor,
    ) {}
}
