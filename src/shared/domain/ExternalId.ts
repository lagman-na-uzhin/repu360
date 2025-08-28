import {SOURCE} from "./enums/service-source.enum";

export class ExternalId {
    private constructor(
        private readonly _source: SOURCE,
        private readonly _source_id: string
    ) {}

    static create() {}
    static fromPersist() {}
}
