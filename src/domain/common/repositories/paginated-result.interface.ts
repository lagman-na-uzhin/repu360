export interface PaginatedResultMeta {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface PaginatedResult<T>  {
    list: T[];

    meta: PaginatedResultMeta
}
