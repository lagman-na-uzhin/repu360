import {UniqueID} from "@domain/common/unique-id";
import {ProfileId} from "@domain/review/profile";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {ReplyType} from "@domain/review/value-object/reply/reply-type.vo";

export class ReplyId extends UniqueID {}

export class Reply {
    private constructor(
        private readonly _id: ReplyId,
        private readonly _external_id: string,
        private readonly _text: string,
        private readonly _isOfficial: boolean,
        private readonly _profileId: ProfileId | null,
        private readonly _type: ReplyType
    ) {}

    static create(externalId: string, text: string, type: ReplyType, isOfficial: boolean, profileId: ProfileId | null) {
        if (!isOfficial && !profileId) {
            throw new Error(EXCEPTION.PROFILE.NOT_FOUND);
        }
        return new Reply(new ReplyId(), externalId, text, isOfficial, profileId, type);
    }

    static fromPersistence(id: string, externalId: string, text: string, isOfficial: boolean, profileId: string | null, type: string) {
        if (!isOfficial && !profileId) {
            throw new Error(EXCEPTION.PROFILE.NOT_FOUND);
        }
        return new Reply(
            new ReplyId(id),
            externalId,
            text,
            isOfficial,
            profileId ? new ProfileId(profileId) : null,
            ReplyType.from(type)
        );
    }

    get isOfficial() {
        return this._isOfficial;
    }
}
