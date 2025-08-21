import {ObjectLiteral, SelectQueryBuilder} from "typeorm";
import {PaginatedResult} from "@application/interfaces/query-services/common/paginated-result.interface";
import {SortParams} from "@application/interfaces/query-services/common/get-list.interface";

export abstract class BaseQueryService {

    /**
     * Применяет пагинацию к QueryBuilder и выполняет запрос для получения PaginatedResult.
     * ОЖИДАЕТ, ЧТО SELECT УЖЕ НАСТРОЕН ДЛЯ ПРОЕКЦИИ В ТИП `DTO`.
     *
     * @param queryBuilder The QueryBuilder configured for data selection,
     * where `Entity` is the primary entity type of the query.
     * @param page The current page number (1-based).
     * @param limit The maximum number of items per page.
     * @returns Promise<PaginatedResult<DTO>>
     */
    protected async paginate<Entity extends ObjectLiteral, DTO>( // <--- Два дженерика: Entity и DTO
        queryBuilder: SelectQueryBuilder<Entity>, // <--- QueryBuilder теперь типизирован Entity
        page: number,
        limit: number
    ): Promise<PaginatedResult<DTO>> {
        page = Math.max(1, page);
        limit = Math.max(1, limit);
        const offset = (page - 1) * limit;

        const total = await queryBuilder.getCount();
        const list = await queryBuilder
            .offset(offset)
            .limit(limit)
            .getRawMany<DTO>(); // <-- DTO здесь - это тип, в который проецируем

        const totalPages = Math.ceil(total / limit);

        return {
            list,
            total,
            totalPages,
            currentPage: page,
            limit,
        };
    }

    /**
     * Применяет логику поиска к QueryBuilder.
     *
     * @param queryBuilder Исходный QueryBuilder.
     * @param searchString Строка поиска.
     * @param searchFields Поля сущности, по которым нужно выполнять поиск (например: ['user.name', 'user.mail']).
     * @returns Модифицированный QueryBuilder.
     */
    protected applySearch<T extends ObjectLiteral>( // <--- T ограничено ObjectLiteral
        queryBuilder: SelectQueryBuilder<T>,
        searchString: string | undefined,
        searchFields: string[]
    ): SelectQueryBuilder<T> {
        if (!searchString) {
            return queryBuilder;
        }

        const conditions = searchFields.map(field => `${field} ILIKE :search`);
        return queryBuilder.andWhere(`(${conditions.join(' OR ')})`, { search: `%${searchString}%` });
    }

    /**
     * Применяет логику сортировки к QueryBuilder.
     *
     * @param queryBuilder Исходный QueryBuilder.
     * @param sortParams Параметры сортировки (поле и порядок).
     * @param allowedSortFields Карта допустимых полей сортировки (ключ DTO, значение DB-путь).
     * @returns Модифицированный QueryBuilder.
     */
    protected applySorting<T extends ObjectLiteral>( // <--- T ограничено ObjectLiteral
        queryBuilder: SelectQueryBuilder<T>,
        sortParams: SortParams | undefined,
        allowedSortFields: Record<string, string>
    ): SelectQueryBuilder<T> {
        if (!sortParams || !sortParams.sortBy || !sortParams.isSortDesc) {
            return queryBuilder;
        }

        const mappedField = allowedSortFields[sortParams.sortBy];
        if (!mappedField) {
            return queryBuilder;
        }

        return queryBuilder.orderBy(mappedField, sortParams.isSortDesc ? 'DESC' : 'ASC');
    }
}
