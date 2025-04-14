export interface PaginatedResultMeta {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResult<T>  {
    list: T[];

    meta: PaginatedResultMeta
}
