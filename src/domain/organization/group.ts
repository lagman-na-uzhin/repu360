import {UniqueID} from "@domain/common/unique-id";
import {OrganizationId} from "@domain/organization/organization";

export class GroupId extends UniqueID {}

export class Group {
    private constructor(
        private readonly _id: GroupId,
        private _name: string,
        private _organizations: OrganizationId[]
    ) {}
}
