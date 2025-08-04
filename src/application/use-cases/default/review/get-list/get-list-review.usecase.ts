import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";
import {Review} from "@domain/review/review";
import {IReviewQs} from "@application/interfaces/query-services/review-qs/review-qs.interface";

export class GetReviewListUseCase {
    constructor(
        private readonly reviewQs: IReviewQs,
    ) {}

    async execute(query: GetListReviewQuery): Promise<PaginatedResult<Review>> {
        return this.reviewQs.getList(query);
    }
}
