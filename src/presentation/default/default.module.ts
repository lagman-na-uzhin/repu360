import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/usecase-proxy/usecase-proxy.module';
import { PartnerController } from '@presentation/control/company/control-partner.controller';
import { EmployeeController } from '@presentation/default/employee/employee.controller';

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [PartnerController, EmployeeController],
})
export class DefaultModule {}
