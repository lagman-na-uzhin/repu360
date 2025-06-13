import { Expose, Type, plainToInstance } from 'class-transformer';

export class PaginatedResultMetaDto {
    @Expose()
    total: number;

    @Expose()
    totalPages: number;

    @Expose()
    currentPage: number;

    @Expose()
    limit: number;
}

export class PaginatedResultDto<T> {
    @Expose()
    @Type(() => Object)
    list: T[];

    @Expose()
    @Type(() => PaginatedResultMetaDto)
    meta: PaginatedResultMetaDto;

    public static fromDomain<DomainItem, T>(
        domainResult: {
            items: DomainItem[];
            total: number;
            page: number;
            limit: number;
        },
        itemToResponseDto: (item: DomainItem) => T,
    ): PaginatedResultDto<T> {
        const { items, total, page, limit } = domainResult;

        const totalPages = Math.ceil(total / limit) || 1;
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        const mappedItems = items.map(itemToResponseDto);

        const meta: PaginatedResultMetaDto = plainToInstance(PaginatedResultMetaDto, {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNext,
            hasPrev,
        }, {
            excludeExtraneousValues: true,
        });

        return plainToInstance(PaginatedResultDto, {
            list: mappedItems,
            meta,
        }, {
            excludeExtraneousValues: true,
        }) as PaginatedResultDto<T>;
    }
}
