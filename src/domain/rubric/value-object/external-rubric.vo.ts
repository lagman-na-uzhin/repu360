import {PLATFORMS} from "@domain/common/platfoms.enum";

export class ExternalRubric {
    private constructor(
        private readonly _platform: PLATFORMS,
        private readonly _external_id: string,
    ) {
    }
}
