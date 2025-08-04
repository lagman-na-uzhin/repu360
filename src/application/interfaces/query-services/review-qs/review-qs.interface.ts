import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";

export interface IReviewQs {
    getList(query: GetListReviewQuery): Promise<PaginatedResult<any>> //TODO
}
