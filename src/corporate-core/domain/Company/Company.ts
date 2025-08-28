import {UniqueID} from "../../../shared/domain/UniqueId";

export class CompanyId extends UniqueID {}

export class Company extends AggregateRoot<CompanyId> {
    private constructor(
        protected readonly _id: CompanyId,
    ) {
        super(_id)
    }
}
