import { Expose, Type, plainToInstance } from 'class-transformer';

export class PaginatedResultDto<T> {
    @Expose()
    list: T[];

    @Expose()
    total: number;

    @Expose()
    totalPages: number;

    @Expose()
    currentPage: number;

    @Expose()
    limit: number;

    public static fromDomain<DomainItem, T>(
        domainResult: {
            list: DomainItem[];
            total: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        },
        itemToResponseDto: (item: DomainItem) => T,
    ): PaginatedResultDto<T> {
        const { list, total, currentPage, limit } = domainResult;

        const totalPages = Math.ceil(total / limit) || 1;

        const mappedItems = list.map(itemToResponseDto);

        return plainToInstance(PaginatedResultDto, {
            list: mappedItems,
            total: Number(total),
            totalPages: Number(totalPages),
            currentPage: Number(currentPage),
            limit: Number(limit),
        }, {
            excludeExtraneousValues: true,
        }) as PaginatedResultDto<T>;
    }
}
