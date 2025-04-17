import {Controller, Get, HttpStatus, Inject, Patch, Post} from '@nestjs/common';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import { CompanyProxy } from '@infrastructure/usecase-proxy/company/company.proxy';
import {CreateCompanyUseCase} from "@application/use-cases/control/company/create/create-company.usecase";
import {CONTROL_ROUTES} from "@presentation/routes";
import {CreateCompanyDto} from "@presentation/control/company/dto/create-company.dto";
import {ByIdCompanyControlUseCase} from "@application/use-cases/control/company/get-by-id/by-id-company.usecase";
import {CompanyId} from "@domain/company/company";
import {RequestBody, RequestQuery} from "@infrastructure/common/decorators/user.decorator";
import {CreateCompanyCommand} from "@application/use-cases/control/company/create/create-company.command";
import {GetListCompanyUseCase} from "@application/use-cases/control/company/get-list/get-list-company.usecase";

@Controller(CONTROL_ROUTES.COMPANY.BASE)
export class ControlCompanyController {
  constructor(
    @Inject(CompanyProxy.CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCaseProxy: UseCaseProxy<CreateCompanyUseCase>,
    @Inject(CompanyProxy.BY_ID_COMPANY_USE_CASE)
    private readonly byIdCompanyControlUseCaseProxy: UseCaseProxy<ByIdCompanyControlUseCase>,
    @Inject(CompanyProxy.GET_LIST_COMPANY_USE_CASE)
    private readonly getListCompanyUseCaseProxy: UseCaseProxy<GetListCompanyUseCase>,
  ) {}

  @Get(CONTROL_ROUTES.COMPANY.BY_ID)
  async getById(@RequestQuery() query: string) {
    return this.byIdCompanyControlUseCaseProxy.getInstance().execute(new CompanyId(query))
  }

  @Get(CONTROL_ROUTES.COMPANY.LIST)
  async getList(@RequestQuery() query: any) {
    return this.getListCompanyUseCaseProxy.getInstance().execute(query);
  };

  @Post(CONTROL_ROUTES.COMPANY.CREATE)
  async create(@RequestBody() dto: CreateCompanyDto) {
    const command = CreateCompanyCommand.of(dto.companyName, dto.actor)

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.createCompanyUseCaseProxy.getInstance().execute(command),
    };
  }

  @Patch(CONTROL_ROUTES.COMPANY.UPDATE)
  async update(@RequestBody() dto: any) {
  }
}
