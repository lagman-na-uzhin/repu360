import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";
import {Review} from "@domain/review/review";

export class GetReviewListUseCase {
    constructor(
        private readonly reviewRepo: IReviewRepository,
    ) {}

    async execute(query: GetListReviewQuery): Promise<PaginatedResult<Review>> {
        const res = await this.reviewRepo.getReviewList(query)
        console.log(res, "res")
        return res;
    }
}
