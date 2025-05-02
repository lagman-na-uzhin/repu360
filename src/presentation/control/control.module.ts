import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/usecase-proxy/usecase-proxy.module';
import {ControlCompanyController} from "@presentation/control/company/control-company.controller";

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [ControlCompanyController],
})
export class ControlModule {}
