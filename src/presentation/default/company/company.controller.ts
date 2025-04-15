import {Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {UserBody, UserQuery} from "@infrastructure/common/decorators/user.decorator";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.COMPANY.BASE)
export class CompanyController {
    constructor(
    ) {}


    @Get(DEFAULT_ROUTES.COMPANY.MY)
    async myCompany(@UserQuery() dto: any) {
    }

    @Patch(DEFAULT_ROUTES.COMPANY.UPDATE)
    async update(
        @UserQuery() query: any,
        @UserBody() body: any
    ) {}

}
