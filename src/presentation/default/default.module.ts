import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/usecase-proxy/usecase-proxy.module';
import { EmployeeController } from '@presentation/default/employee/employee.controller';
import {AuthController} from "@presentation/default/auth/auth.controller";

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [AuthController, EmployeeController],
})
export class DefaultModule {}
