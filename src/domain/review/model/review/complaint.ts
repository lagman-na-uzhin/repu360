import {UniqueID} from "@domain/common/unique-id";

export class ComplaintId extends UniqueID {}

export class Complaint {
    private constructor(
        private readonly id: ComplaintId
    ) {
    }
}
