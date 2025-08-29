import {PLATFORMS} from "@domain/common/platfoms.enum";
import {UniqueID} from "@domain/common/unique-id";

export class ExternalRubricId extends UniqueID {}
export class ExternalRubric {
    private constructor(
        private readonly _id: ExternalRubricId,
        private readonly _platform: PLATFORMS,
        private readonly _name: string,
        private readonly _external_id: string,
    ) {}

    static create(platform: PLATFORMS, name: string, externalId: string) {
        return new ExternalRubric(new ExternalRubricId(), platform, name, externalId);
    }
    static fromPersistence(id: string, platform: PLATFORMS, name: string, externalId: string) {
        return new ExternalRubric(ExternalRubricId.of(id), platform, name, externalId);
    }
    get platform() {return this._platform}
    get name() {return this._name}
    get externalId() {return this._external_id}
}
