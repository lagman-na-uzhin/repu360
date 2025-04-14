import {Controller, Patch, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {UserBody, UserInitQuery, UserQuery} from "@infrastructure/common/decorators/user.decorator";
import {EmployeeMeDto} from "@presentation/default/employee/dto/me.dto";
import {EmployeeMeInput} from "@application/use-cases/default/employee/me/me.input";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.COMPANY.BASE)
export class CompanyController {
    constructor(
    ) {}


    @Get(DEFAULT_ROUTES.COMPANY.MY)
    async myCompany(@@UserQuery('id') companyId: string) {
    }

    @Patch(DEFAULT_ROUTES.COMPANY.UPDATE)
    async update(
        @@UserQuery('id') companyId: string,
        @UserBody() dto: any
    ) {}

}
