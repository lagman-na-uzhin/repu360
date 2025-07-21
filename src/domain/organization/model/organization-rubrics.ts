import {UniqueID} from "@domain/common/unique-id";

export class RubricId extends UniqueID {}

export class Rubric {
    private constructor(
        private readonly _Id: RubricId,
        private readonly _alias: string,
        private readonly _name: string,
        private _type: "primary" | "additional",
    ) {}

    static create(alias: string, name: string, type: "primary" | "additional") {
        return new Rubric(new RubricId(), alias, name, type);
    }

    static fromPersistence(id: string, alias: string, name: string, type: "primary" | "additional") {
        return new Rubric(new RubricId(id), alias, name, type);
    }

    get id() {return this._Id}
    get name() {return this._name}
    get alias() {return this._alias}
    get type() {return this._type}
}
