import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import { SUCCESS } from '@infrastructure/common/interceptors/http-success-codes.const';
import { PartnerProxy } from '@infrastructure/usecase-proxy/partner/partner.proxy';
import { RegisterPartnerDto } from '@presentation/default/partner/dto/register-partner.dto';
import {
  RegisterPartnerUseCase
} from "@application/use-cases/control/company/company-register/company-register.usecase";

@Controller('partner')
export class PartnerController {
  constructor(
    @Inject(PartnerProxy.REGISTER_PARTNER_USE_CASE)
    private readonly registerPartnerUseCaseProxy: UseCaseProxy<RegisterPartnerUseCase>,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterPartnerDto) {
    return {
      statusCode: 201,
      data: await this.registerPartnerUseCaseProxy.getInstance().execute(payload),
      message: SUCCESS.PARTNER.SUCCESS_REGISTER,
    };
  }
}
