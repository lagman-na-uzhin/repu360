import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/usecase-proxy/usecase-proxy.module';
import { EmployeeController } from '@presentation/default/employee/employee.controller';

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [EmployeeController],
})
export class ControlModule {}
