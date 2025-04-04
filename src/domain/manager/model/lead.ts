import {UniqueEntityID} from "@domain/common/unique-id";

export class LeadId extends UniqueEntityID {}

export class Lead {
    private constructor(
       private readonly _id: LeadId
    ) {}
}
