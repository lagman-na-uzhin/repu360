import {UniqueID} from "@domain/common/unique-id";
import {LANGUAGE} from "@domain/common/language.enum";
import {PlacementId} from "@domain/placement/placement";

export class ReplyTemplateId extends UniqueID {}

export class ReplyTemplate {
    private constructor(
        private readonly _id: ReplyTemplateId,
        private readonly _placementId: PlacementId,
        private readonly _text: string,
        private readonly _language: LANGUAGE,
    ) {}

    static create() {

    }

    static fromPersistence(id: string, placementId: string, text: string, language: LANGUAGE) {
        return new ReplyTemplate(new ReplyTemplateId(id), new PlacementId(placementId), text, language);
    }

    get id() {
        return this._id;
    }

    get text() {
        return this._text;
    }
}
