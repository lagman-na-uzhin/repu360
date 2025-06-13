import {Controller, HttpCode, HttpStatus, Inject, Patch, Post, Put, UseGuards} from '@nestjs/common';
import {CreateCompanyUseCase} from "@application/use-cases/control/company/commands/create/create-company.usecase";
import {CONTROL_ROUTES} from "@presentation/routes";
import {CreateCompanyDto} from "@presentation/control/company/dto/create-company.dto";
import {CreateCompanyCommand} from "@application/use-cases/control/company/commands/create/create-company.command";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {CompanyProxy} from "@application/use-case-proxies/company/company.proxy";
import {LeadProxy} from "@application/use-case-proxies/lead/lead.proxy";
import {
    AssignManagerLeadUseCase
} from "@application/use-cases/control/lead/commands/assign-manager/assign-manager-lead.usecase";
import {ConfirmLeadUseCase} from "@application/use-cases/control/lead/commands/confirm/confirm-lead.usecase";
import {
    AssignManagerLeadCommand
} from "@application/use-cases/control/lead/commands/assign-manager/assign-manager-lead.command";
import {ConfirmLeadCommand} from "@application/use-cases/control/lead/commands/confirm/confirm-lead.command";
import {AssignManagerRequestDto} from "@presentation/control/lead/dto/assign-manager.request";
import {ConfirmLeadRequestDto} from "@presentation/control/lead/dto/confirm-lead.request";


@Controller(CONTROL_ROUTES.LEAD.BASE)
@UseGuards(JwtAuthGuard)
export class ControlLeadController {
    constructor(
        @Inject(LeadProxy.ASSIGN_MANAGER_USE_CASE)
        private readonly assignManagerLeadUseCaseProxy: UseCaseProxy<AssignManagerLeadUseCase>,
        @Inject(LeadProxy.CONFIRM_LEAD_USE_CASE)
        private readonly confirmLeadUseCaseProxy: UseCaseProxy<ConfirmLeadUseCase>,
    ) {}

    @Patch(CONTROL_ROUTES.LEAD.ASSIGN)
    async assign(
        @RequestBody() dto: AssignManagerRequestDto,
        @RequestActor() actor
    ) {
        const command = AssignManagerLeadCommand.of(dto, actor);
        await this.assignManagerLeadUseCaseProxy.getInstance().execute(command);
    }


    @Patch(CONTROL_ROUTES.LEAD.CONFIRM)
    async confirm(
        @RequestBody() dto: ConfirmLeadRequestDto,
        @RequestActor() actor
    ) {
        const command = ConfirmLeadCommand.of(dto, actor);
        await this.confirmLeadUseCaseProxy.getInstance().execute(command);
    }
}
