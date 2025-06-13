import {Controller, HttpCode, HttpStatus, Inject, Post} from '@nestjs/common';
import {GENERAl_ROUTES} from "@presentation/routes";
import {LeadProxy} from "@application/use-case-proxies/lead/lead.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {CreateLeadUseCase} from "@application/use-cases/default/lead/commands/create/create-lead.usecase";
import {CreateLeadCommand} from "@application/use-cases/default/lead/commands/create/create-lead-command";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {CreateLeadRequestDto} from "@presentation/general/landing/dto/create-lead.request";


@Controller(GENERAl_ROUTES.LANDING.BASE)
export class LandingController {
    constructor(
        @Inject(LeadProxy.CREATE_LEAD_USE_CASE)
        private readonly createLeadUseCaseProxy: UseCaseProxy<CreateLeadUseCase>,
    ) {}

    @Post(GENERAl_ROUTES.LANDING.CREATE_LEAD)
    @HttpCode(HttpStatus.CREATED)
    async createLead(
        @RequestBody() dto: CreateLeadRequestDto
    ) {
        const command = CreateLeadCommand.of(dto);
        await this.createLeadUseCaseProxy.getInstance().execute(command);
    }
}
