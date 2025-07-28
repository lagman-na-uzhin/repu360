import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res, UseGuards} from '@nestjs/common';
import {FastifyRequest, FastifyReply} from 'fastify';
import {EmployeeLoginDto, ManagerLoginDto} from "@presentation/general/auth/dto/login.request";
import {ManagerLoginCommand} from "@application/use-cases/default/auth/commands/login-admin/login.command";
import {ManagerLoginUseCase} from "@application/use-cases/default/auth/commands/login-admin/login.usecase";
import {EmployeeLoginCommand} from "@application/use-cases/default/auth/commands/login/login.command";
import {EmployeeLoginUseCase} from "@application/use-cases/default/auth/commands/login/login.usecase";
import {GENERAl_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {UserMeQuery} from "@application/use-cases/default/auth/queries/me/me.query";
import {MeUseCase} from "@application/use-cases/default/auth/queries/me/me.usecase";
import {AuthProxy} from "@infrastructure/providers/auth/auth.proxy";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {Actor} from "@domain/policy/actor";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {UserMeResponseDto} from "@presentation/general/auth/dto/user-me.response";

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
        // Отправляем пустой ответ с кодом 204 No Content
        // или 200 OK с пустым телом, но 204 более корректен для отсутствия контента
        res.status(204).send();
        // В Express: res.status(204).end();
    }
}
