import {Controller, Get, Inject} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestParams} from "@infrastructure/common/decorators/request-param.decorator";
import {ByIdManagerRequestParamsDto} from "@presentation/default/manager/dto/by-id-manager.request";
import {ByIdManagerQuery} from "@application/use-cases/default/manager/queries/by-id-manager.query";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ByIdManagerUseCase} from "@application/use-cases/default/manager/queries/by-id-manager.usecase";
import {ManagerProxy} from "@application/use-case-proxies/manager/manager.proxy";
import {ManagerResponseDto} from "@presentation/dtos/manager.response";

@Controller(DEFAULT_ROUTES.MANAGER.BASE)
export class ManagerController {
    constructor(
        @Inject(ManagerProxy.BY_ID)
        private readonly byIdProxy: UseCaseProxy<ByIdManagerUseCase>
    ) {}

    @Get(DEFAULT_ROUTES.MANAGER.BY_ID)
    async getById(
        @RequestParams() params: ByIdManagerRequestParamsDto,
        @RequestActor() actor
    ) {
        const query = ByIdManagerQuery.of(params, actor);
        const domain = await this.byIdProxy.getInstance().execute(query);

        return ManagerResponseDto.fromDomain(domain);
    }

}
