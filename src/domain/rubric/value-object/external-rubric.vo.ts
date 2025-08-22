import {PLATFORMS} from "@domain/common/platfoms.enum";

export class ExternalRubric {
    private constructor(
        private readonly _platform: PLATFORMS,
        private readonly _name: string,
        private readonly _external_id: string,
    ) {}

    static create(platform: PLATFORMS, name: string, externalId: string) {
        return new ExternalRubric(platform, name, externalId);
    }
    get platform() {return this._platform}
    get name() {return this._name}
    get externalId() {return this._external_id}
}
