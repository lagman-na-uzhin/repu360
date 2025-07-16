import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetReviewListQueryDto} from "@presentation/default/review/dto/get-list-review.request";
import {OrganizationProxy} from "@application/use-case-proxies/organization/organization.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    AddOrganizationUseCase
} from "@application/use-cases/default/organization/commands/add/add-organization.usecase";
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {GetReviewListUseCase} from "@application/use-cases/default/review/get-list/get-list-review.usecase";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";
import {PaginatedResultDto} from "@presentation/dtos/paginated-response";
import {OrganizationResponseDto} from "@presentation/dtos/organization.response";
import {ReviewResponseDto} from "@presentation/dtos/review.response";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.REVIEW.BASE)
export class ReviewController {
    constructor(
        @Inject(ReviewProxy.GET_LIST)
        private readonly GetReviewList: UseCaseProxy<GetReviewListUseCase>,
    ) {}


    @Get(DEFAULT_ROUTES.REVIEW.LIST)
    async getList(
        @RequestQuery() dto: GetReviewListQueryDto,
        @RequestActor() actor
    ) {
        const query = GetListReviewQuery.of(dto, actor)
        const result = await this.GetReviewList.getInstance().execute(query);
        return PaginatedResultDto.fromDomain(result, ReviewResponseDto.fromDomain)
    }
}
