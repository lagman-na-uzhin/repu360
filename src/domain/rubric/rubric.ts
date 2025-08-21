import {UniqueID} from "@domain/common/unique-id";
import {ExternalRubric} from "@domain/rubric/value-object/external-rubric.vo";

export class RubricId extends UniqueID {}

export class Rubric {
    private constructor(
        private readonly _Id: RubricId,
        private readonly _name: string,
        private _external: ExternalRubric[],
    ) {}

    static create(name: string, external: ExternalRubric[]) {
        return new Rubric(new RubricId(), name, external);
    }

    static fromPersistence(id: string, name: string, external: ExternalRubric[]) {
        return new Rubric(new RubricId(id), name, external);
    }

    get id() {return this._Id}
    get name() {return this._name}
    get external() {return this._external}
}
