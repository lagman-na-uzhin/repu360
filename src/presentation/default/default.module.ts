import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import { EmployeeController } from '@presentation/default/employee/employee.controller';
import {OrganizationController} from "@presentation/default/organization/organization.controller";
import {CompanyController} from "@presentation/default/company/company.controller";
import {ManagerController} from "@presentation/default/manager/manager.controlller";
import {ReviewController} from "@presentation/default/review/review.controller";
import {ExternalController} from "@presentation/default/external/external.controller";
import {RoleController} from "@presentation/default/role/role.controller";

@Module({
  imports: [UsecaseProxyModule.register()],
  providers: [],
  controllers: [
      EmployeeController,
      OrganizationController,
      CompanyController,
      ManagerController,
      ReviewController,
      ExternalController,
      RoleController
  ],
})
export class DefaultModule {}
