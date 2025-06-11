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

@Controller(CONTROL_ROUTES.COMPANY.BASE)
@UseGuards(JwtAuthGuard)
export class ControlCompanyController {
  constructor(
    @Inject(CompanyProxy.CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCaseProxy: UseCaseProxy<CreateCompanyUseCase>,
    // @Inject(CompanyProxy.BY_ID_COMPANY_USE_CASE)
    // private readonly byIdCompanyControlUseCaseProxy: UseCaseProxy<ByIdCompanyControlUseCase>,
    // @Inject(CompanyProxy.GET_LIST_COMPANY_USE_CASE)
    // private readonly getListCompanyUseCaseProxy: UseCaseProxy<GetListCompanyUseCase>,
  ) {}

  // @Get(CONTROL_ROUTES.COMPANY.BY_ID)
  // async getById(@RequestQuery() query: string) {
  //   return this.byIdCompanyControlUseCaseProxy.getInstance().execute(new CompanyId(query))
  // }
  //
  // @Get(CONTROL_ROUTES.COMPANY.LIST)
  // async getList(@RequestQuery() query: any) {
  //   return this.getListCompanyUseCaseProxy.getInstance().execute(query);
  // };

  @Post(CONTROL_ROUTES.COMPANY.CREATE)
  async create(@RequestBody() dto: CreateCompanyDto, @RequestActor() actor: any) {
    const command = CreateCompanyCommand.of(dto, actor)

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.createCompanyUseCaseProxy.getInstance().execute(command),
    };
  }
}
