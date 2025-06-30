import {Controller, HttpStatus, Inject, Post, Put, UseGuards} from '@nestjs/common';
import {CreateCompanyUseCase} from "@application/use-cases/control/company/commands/create/create-company.usecase";
import {CONTROL_ROUTES} from "@presentation/routes";
import {CreateCompanyDto} from "@presentation/control/company/dto/create-company.dto";
import {CreateCompanyCommand} from "@application/use-cases/control/company/commands/create/create-company.command";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {CompanyProxy} from "@application/use-case-proxies/company/company.proxy";
import {
    UpdateCompanyUseCase
} from "@application/use-cases/default/company/commands/update-company/update-company.usecase";
import {UpdateCompanyDto} from "@presentation/control/company/dto/update-company.dto";
import {
    UpdateCompanyCommand
} from "@application/use-cases/default/company/commands/update-company/update-company.command";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {
    CreateSubscriptionUseCase
} from "@application/use-cases/default/subscription/create/create-subscription.usecase";
import {SubscriptionProxy} from "@application/use-case-proxies/subscription/subscription.proxy";
import {
    CreateSubscriptionCommand
} from "@application/use-cases/default/subscription/create/create-subscription.command";

@Controller(CONTROL_ROUTES.SUBSCRIPTION.BASE)
@UseGuards(JwtAuthGuard)
export class ControlSubscriptionController {
    constructor(
        @Inject(SubscriptionProxy.CREATE_SUBSCRIPTION_USE_CASE)
        private readonly createSubscriptionUseCaseProxy: UseCaseProxy<CreateSubscriptionUseCase>
    ) {}


    @Post(CONTROL_ROUTES.SUBSCRIPTION.CREATE)
    async create(@RequestBody() dto: any, @RequestActor() actor: any) {//TODO
        const command = CreateSubscriptionCommand.of(dto, actor);

        return {
            statusCode: HttpStatus.CREATED,
            data: await this.createSubscriptionUseCaseProxy.getInstance().execute(command),
        };
    }
}
