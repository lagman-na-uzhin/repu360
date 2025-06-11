import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import { EmployeeController } from '@presentation/default/employee/employee.controller';
import {OrganizationController} from "@presentation/default/organization/organization.controller";
import {CompanyController} from "@presentation/default/company/company.controller";

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [EmployeeController, OrganizationController, CompanyController],
})
export class DefaultModule {}
