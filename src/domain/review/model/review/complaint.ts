import {UniqueEntityID} from "@domain/common/unique-id";

export class ComplaintId extends UniqueEntityID {}

export class Complaint {
    private constructor(
        private readonly id: ComplaintId
    ) {
    }
}
