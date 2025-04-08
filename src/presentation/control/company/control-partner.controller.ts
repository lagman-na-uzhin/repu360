import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import { SUCCESS } from '@infrastructure/common/interceptors/http-success-codes.const';
import { PartnerProxy } from '@infrastructure/usecase-proxy/partner/partner.proxy';
import { RegisterPartnerDto } from '@presentation/control/company/dto/register-partner.dto';
import {
  RegisterPartnerUseCase
} from "@application/use-cases/control/company/create/create-company.usecase";
import {ROUTES} from "@presentation/routes";

@Controller(ROUTES.CONTROL.COMPANY.BASE)
export class ControlCompanyController {
  constructor(
    @Inject(PartnerProxy.REGISTER_PARTNER_USE_CASE)
    private readonly registerPartnerUseCaseProxy: UseCaseProxy<RegisterPartnerUseCase>,
  ) {}

  @Post(ROUTES.CONTROL.COMPANY.REGISTER)
  async register(@Body() payload: RegisterPartnerDto) {
    return {
      statusCode: 201,
      data: await this.registerPartnerUseCaseProxy.getInstance().execute(payload),
      message: SUCCESS.PARTNER.SUCCESS_REGISTER,
    };
  }
}
