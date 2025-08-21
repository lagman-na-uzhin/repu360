import {Controller, Get, Inject, Res} from '@nestjs/common';
import {FastifyReply} from 'fastify';
import {ManagerLoginUseCase} from "@application/use-cases/default/auth/commands/login-admin/login.usecase";
import {EmployeeLoginUseCase} from "@application/use-cases/default/auth/commands/login/login.usecase";
import {MeUseCase} from "@application/use-cases/default/auth/queries/me/me.usecase";
import {AuthProxy} from "@infrastructure/providers/auth/auth.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

@Controller()
export class TestController {
    constructor(
        @Inject(AuthProxy.EMPLOYEE_LOGIN_USE_CASE)
        private readonly employeeLoginUseCaseProxy: UseCaseProxy<EmployeeLoginUseCase>,
        @Inject(AuthProxy.MANAGER_LOGIN_USE_CASE)
        private readonly managerLoginUseCaseProxy: UseCaseProxy<ManagerLoginUseCase>,
        @Inject(AuthProxy.ME_USE_CASE)
        private readonly meUseCaseProxy: UseCaseProxy<MeUseCase>
    ) {}

    @Get('favicon.ico')
    handleFavicon(@Res() res: FastifyReply) {
        res.status(204).send();
    }
}
