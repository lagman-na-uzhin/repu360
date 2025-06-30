import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import {ControlCompanyController} from "@presentation/control/company/control-company.controller";
import {ControlLeadController} from "@presentation/control/lead/control-lead.controller";

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [ControlCompanyController, ControlLeadController],
})
export class ControlModule {}
