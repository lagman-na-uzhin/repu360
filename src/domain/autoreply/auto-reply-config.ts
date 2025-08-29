import {UniqueID} from "@domain/common/unique-id";
export class AutoReplyId extends UniqueID {}

export class AutoReplyConfig {
    private constructor(
        private readonly _id: AutoReplyId,
        private _isEnabled: boolean,
        private _startTime: string,
        private _endTime: string,
    ) {}
}
