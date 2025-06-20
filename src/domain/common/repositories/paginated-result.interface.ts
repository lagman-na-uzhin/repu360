export interface PaginatedResult<T>  {
    list: T[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}
