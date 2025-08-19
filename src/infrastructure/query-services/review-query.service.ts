import { EntityManager } from 'typeorm';
import { BaseQueryService } from '@infrastructure/query-services/base-query.service';
import { PaginatedResult } from '@application/interfaces/query-services/common/paginated-result.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IReviewQs } from '@application/interfaces/query-services/review-qs/review-qs.interface';
import { ReviewEntity } from '@infrastructure/entities/review/review.entity';
import {QSReviewDto} from "@application/interfaces/query-services/review-qs/dto/response/review.dto";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";

export class ReviewQueryService extends BaseQueryService implements IReviewQs {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {
        super();
    }

    async getList(query: GetListReviewQuery): Promise<PaginatedResult<QSReviewDto>> {
        const { filter, pagination, sort, search } = query;
        let queryBuilder = this.manager.getRepository(ReviewEntity)
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.profile', 'profile')
            .leftJoin('review.placement', "placement")
            .leftJoin('placement.organization', "organization")
            .where('organization.companyId = :companyId', { companyId: filter.companyId.toString() });

        if (filter?.groupIds && filter.groupIds.length > 0) {
            queryBuilder.leftJoin('organization.group', "group");
            queryBuilder.andWhere('group.id = ANY(:groupIds)', { groupIds: filter.groupIds.map(i => i.toString()) });
        }

        if (filter?.cities && filter.cities.length > 0) {
            queryBuilder.leftJoin('organization.address', "address");
            queryBuilder.andWhere('address.city = ANY(:cities)', { cities: filter.cities });
        }

        if (filter?.organizationIds && filter.organizationIds.length > 0) {
            queryBuilder.andWhere('organization.id = ANY(:organizationIds)', { organizationIds: filter.organizationIds.map(i => i.toString()) });
        }

        if (filter?.platform) {
            queryBuilder.andWhere('review.platform = :platform', { platform: filter.platform });
        }

        if (filter?.tone === 'positive') {
            queryBuilder.andWhere('review.rating >= 4');
        } else if (filter?.tone === 'negative') {
            queryBuilder.andWhere('review.rating <= 3');
        }
        // if (filter?.hasReplies !== undefined) {
        //     if (filter.hasReplies) {
        //         queryBuilder = queryBuilder.andWhere('replies.id IS NOT NULL');
        //     } else {
        //         queryBuilder = queryBuilder.andWhere('replies.id IS NULL');
        //     }
        // }

        queryBuilder = this.applySearch(queryBuilder, search, [
            'review.text', 'profile.firstname', 'profile.lastName'
        ]);

        const allowedSortFieldsMap: Record<string, string> = {
            'id': 'review.id',
            'rating': 'review.rating',
            'createdAt': 'review.createdAt',
            'profile.firstname': 'profile.firstname',
        };
        queryBuilder = this.applySorting(queryBuilder, sort, allowedSortFieldsMap);

        const [reviews, total] = await queryBuilder
            .skip((pagination.page - 1) * pagination.limit)
            .take(pagination.limit)
            .getManyAndCount();

        console.log(reviews, "reviews")
        const totalPages = Math.ceil(total / pagination.limit);

        const list: QSReviewDto[] = reviews.map(review => ({
            id: review.id,
            text: review.text,
            rating: review.rating,
            platform: review.platform,
            createdAt: review.createdAt,
            placementId: review.placementId,
            profile: review.profile ? {
                id: review.profile.id,
                firstname: review.profile.firstname,
                lastName: review.profile.lastName,
                avatar: review.profile.avatar,
            } : undefined,

            media: review.media?.map(media => ({
                id: media.id,
                url: media.url,
            })) ?? [],

            replies: review.replies?.map(reply => ({
                id: reply.id,
                externalId: reply.externalId,
                text: reply.text,
                isOfficial: reply.isOfficial,
                type: reply.type,
                createdAt: reply.createdAt,
                updatedAt: reply.updatedAt,
            })) ?? [],

            detail: review.yandexDetail
                ? { externalId: review.yandexDetail.externalId }
                : review.twogisDetail
                    ? { externalId: review.twogisDetail.externalId }
                    : null,
        }));

        return {
            list,
            total,
            totalPages,
            currentPage: pagination.page,
            limit: pagination.limit,
        };
    }
}
