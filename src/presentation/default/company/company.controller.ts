import {Controller, Get, Inject, Param, Patch, Put, UseGuards} from '@nestjs/common';
import {CONTROL_ROUTES, DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {UpdateCompanyDto} from "@presentation/control/company/dto/update-company.dto";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {
    UpdateCompanyCommand
} from "@application/use-cases/default/company/commands/update-company/update-company.command";
import {CompanyProxy} from "@application/use-case-proxies/company/company.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    UpdateCompanyUseCase
} from "@application/use-cases/default/company/commands/update-company/update-company.usecase";
import {RequestParams} from "@infrastructure/common/decorators/request-param.decorator";
import {ByIdCompanyUseCase} from "@application/use-cases/default/company/queries/by-id/by-id-company.usecase";
import {CompanyId} from "@domain/company/company";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.COMPANY.BASE)
export class CompanyController {
    constructor(
        @Inject(CompanyProxy.UPDATE_COMPANY_USE_CASE)
        private readonly updateCompanyUseCaseProxy: UseCaseProxy<UpdateCompanyUseCase>,
        @Inject(CompanyProxy.BY_ID_COMPANY_USE_CASE)
        private readonly myCompanyUseCaseProxy: UseCaseProxy<ByIdCompanyUseCase>,
    ) {}


    @Get(DEFAULT_ROUTES.COMPANY.BY_ID)
    async byId(@RequestParams() params: { companyId: string }) {
        return this.myCompanyUseCaseProxy.getInstance().execute(new CompanyId(params.companyId));
    }

    @Put(DEFAULT_ROUTES.COMPANY.UPDATE)
    async update(
        @RequestBody() dto: UpdateCompanyDto,
        @RequestParams() params: { companyId: string },
        @RequestActor() actor: any)
    {
        const command = UpdateCompanyCommand.of({...dto, companyId: params.companyId}, actor);
        return this.updateCompanyUseCaseProxy.getInstance().execute(command);
    }

}
