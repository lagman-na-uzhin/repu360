import {SelectQueryBuilder} from "typeorm";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";

export abstract class BaseQueryService {
    protected async paginateQuery<T>(
        queryBuilder: SelectQueryBuilder<T>,
        page: number,
        limit: number
    ): Promise<PaginatedResult<T>> {
        page = Math.max(1, page);
        limit = Math.max(1, limit);
        const offset = (page - 1) * limit;

        const total = await queryBuilder.getCount();
        const list = await queryBuilder
            .offset(offset)
            .limit(limit)
            .getRawMany<T>();

        const totalPages = Math.ceil(total / limit);

        return {
            list,
            total,
            totalPages,
            currentPage: page,
            limit,
        };
    }
}
