import {Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {RequestBody} from "@infrastructure/common/decorators/request-body.decorator";

@UseGuards(JwtAuthGuard)
@Controller(DEFAULT_ROUTES.COMPANY.BASE)
export class CompanyController {
    constructor(
    ) {}


    @Get(DEFAULT_ROUTES.COMPANY.MY)
    async myCompany(@RequestQuery() dto: any) {
    }

    @Patch(DEFAULT_ROUTES.COMPANY.UPDATE)
    async update(
        @RequestQuery() query: any,
        @RequestBody() body: any
    ) {}

}
