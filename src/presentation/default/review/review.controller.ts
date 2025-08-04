import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetReviewListQueryDto} from "@presentation/default/review/dto/get-list-review.request";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {GetReviewListUseCase} from "@application/use-cases/default/review/get-list/get-list-review.usecase";
import {GetListReviewQuery} from "@application/use-cases/default/review/get-list/get-list-review.query";

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
        return this.GetReviewList.getInstance().execute(query);
    }
}
