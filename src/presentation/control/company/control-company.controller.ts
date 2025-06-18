import {Controller, Get, HttpStatus, Inject, Post, Put, UseGuards} from '@nestjs/common';
import {CreateCompanyUseCase} from "@application/use-cases/control/company/commands/create/create-company.usecase";
import {CONTROL_ROUTES} from "@presentation/routes";
import {CreateCompanyDto} from "@presentation/control/company/dto/create-company.dto";
import {CreateCompanyCommand} from "@application/use-cases/control/company/commands/create/create-company.command";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {CompanyProxy} from "@application/use-case-proxies/company/company.proxy";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {GetListCompanyQuery} from "@application/use-cases/control/company/queries/get-list/get-list-company.query";
import {GetListCompanyUseCase} from "@application/use-cases/control/company/queries/get-list/get-list-company.usecase";
import {GetCompanyListQueryDto} from "@presentation/control/company/dto/get-list-company.request";


@Controller(CONTROL_ROUTES.COMPANY.BASE)
@UseGuards(JwtAuthGuard)
export class ControlCompanyController {
  constructor(
    @Inject(CompanyProxy.CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCaseProxy: UseCaseProxy<CreateCompanyUseCase>,
    @Inject(CompanyProxy.GET_LIST_COMPANY_USE_CASE)
    private readonly getListCompanyUseCaseProxy: UseCaseProxy<GetListCompanyUseCase>,
  ) {}

  @Get(CONTROL_ROUTES.COMPANY.LIST)
  async getList(
      @RequestQuery() dto: GetCompanyListQueryDto,
      @RequestActor() actor: any
  ) {
    console.log(dto, "dto")
    const query = GetListCompanyQuery.of(dto, actor)
    console.log(query, "query")

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.getListCompanyUseCaseProxy.getInstance().execute(query),
    };
  }

  @Post(CONTROL_ROUTES.COMPANY.CREATE)
  async create(@RequestBody() dto: CreateCompanyDto, @RequestActor() actor: any) {
    const command = CreateCompanyCommand.of(dto, actor)

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.createCompanyUseCaseProxy.getInstance().execute(command),
    };
  }
}
