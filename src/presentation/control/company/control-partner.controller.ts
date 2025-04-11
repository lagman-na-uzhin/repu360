import {Controller, HttpStatus, Inject, Post} from '@nestjs/common';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import { CompanyProxy } from '@infrastructure/usecase-proxy/company/company.proxy';
import {CreateCompanyDto} from '@presentation/control/company/dto/register-partner.dto';
import {CreateCompanyUseCase} from "@application/use-cases/control/company/create/create-company.usecase";
import {ROUTES} from "@presentation/routes";
import {CreateCompanyInput} from "@application/use-cases/control/company/create/create-company.input";
import {ManagerBody} from "@infrastructure/common/decorators/user.decorator";

@Controller(ROUTES.CONTROL.COMPANY.BASE)
export class ControlCompanyController {
  constructor(
    @Inject(CompanyProxy.CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCaseProxy: UseCaseProxy<CreateCompanyUseCase>,
  ) {}

  @Post(ROUTES.CONTROL.COMPANY.CREATE)
  async create(@ManagerBody() dto: CreateCompanyDto) {
    const input = CreateCompanyInput.of(dto.companyName, dto.manager)

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.createCompanyUseCaseProxy.getInstance().execute(input),
    };
  }
}
