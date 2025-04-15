import {Controller, Get, HttpStatus, Inject, Patch, Post, ClassSerializerInterceptor} from '@nestjs/common';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import { CompanyProxy } from '@infrastructure/usecase-proxy/company/company.proxy';
import {CreateCompanyUseCase} from "@application/use-cases/control/company/create/create-company.usecase";
import {CONTROL_ROUTES} from "@presentation/routes";
import {CreateCompanyDto} from "@presentation/control/company/dto/create-company.dto";
import {ByIdCompanyControlUseCase} from "@application/use-cases/control/company/get-by-id/by-id-company.usecase";
import {CompanyId} from "@domain/company/company";
import {ActorBody} from "@infrastructure/common/decorators/user.decorator";
import {CreateCompanyCommand} from "@application/use-cases/control/company/create/create-company.command";

@Controller(CONTROL_ROUTES.COMPANY.BASE)
export class ControlCompanyController {
  constructor(
    @Inject(CompanyProxy.CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCaseProxy: UseCaseProxy<CreateCompanyUseCase>,


    @Inject(CompanyProxy.BT_ID_COMPANY_USE_CASE)
    private readonly byIdCompanyControlUseCaseProxy: UseCaseProxy<ByIdCompanyControlUseCase>,
  ) {}

  @Get(CONTROL_ROUTES.COMPANY.BY_ID)
  async getById(@ManagerQuery('companyId') id: string) {
    return this.byIdCompanyControlUseCaseProxy.getInstance().execute(new CompanyId(id))
  }

  @Get(CONTROL_ROUTES.COMPANY.LIST)
  async getList(@ManagerQuery() dto: any) {
  };

  @Post(CONTROL_ROUTES.COMPANY.CREATE)
  async create(@ActorBody() dto: CreateCompanyDto) {
    const command = CreateCompanyCommand.of(dto.companyName, dto.actor)

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.createCompanyUseCaseProxy.getInstance().execute(command),
    };
  }

  @Patch(CONTROL_ROUTES.COMPANY.UPDATE)
  async update(@ManagerBody() dto: any) {
  }
}
