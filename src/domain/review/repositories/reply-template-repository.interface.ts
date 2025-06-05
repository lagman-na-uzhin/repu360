import {PlacementId} from "@domain/placement/placement";
import {ReplyTemplate} from "@domain/review/model/review/reply/reply-template";
import {LANGUAGE} from "@domain/common/language.enum";

export interface IReplyTemplateRepository {
    getCustomTemplate(placementId: PlacementId, language: LANGUAGE): Promise<ReplyTemplate | null>
}
