import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res, UseGuards} from '@nestjs/common';
import {FastifyRequest, FastifyReply} from 'fastify';
import {EmployeeLoginDto, ManagerLoginDto} from "@presentation/general/auth/dto/login.dto";
import {ManagerLoginCommand} from "@application/use-cases/default/manager/commands/login/login.command";
import {ManagerLoginUseCase} from "@application/use-cases/default/manager/commands/login/login.usecase";
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

@Controller(GENERAl_ROUTES.AUTH.BASE)
export class AuthController {
    constructor(
        @Inject(AuthProxy.EMPLOYEE_LOGIN_USE_CASE)
        private readonly employeeLoginUseCaseProxy: UseCaseProxy<EmployeeLoginUseCase>,
        @Inject(AuthProxy.MANAGER_LOGIN_USE_CASE)
        private readonly managerLoginUseCaseProxy: UseCaseProxy<ManagerLoginUseCase>,
        @Inject(AuthProxy.ME_USE_CASE)
        private readonly meUseCaseProxy: UseCaseProxy<MeUseCase>
    ) {}

    @Post(GENERAl_ROUTES.AUTH.EMPLOYEE_LOGIN)
    @HttpCode(HttpStatus.OK)
    async employeeLogin(
        @Body() dto: EmployeeLoginDto,
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const cmd = EmployeeLoginCommand.of(dto)

        const { token, expire } = await this.employeeLoginUseCaseProxy
            .getInstance()
            .execute(cmd);

        reply.setCookie('Authentication', token, {
            httpOnly: true,
            path: '/',
            maxAge: Number(expire),
        });

        reply.send({})
    }


    @Post(GENERAl_ROUTES.AUTH.MANAGER_LOGIN)
    async managerLogin(
        @Body() dto: ManagerLoginDto,
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply
    ) {        console.log("manager login")
        const cmd = ManagerLoginCommand.of(dto)
        const { token, expireTime } = await this.managerLoginUseCaseProxy
            .getInstance()
            .execute(cmd);

        reply.setCookie('Authentication', token, {
            httpOnly: true,
            path: '/',
            maxAge: Number(expireTime),
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(GENERAl_ROUTES.AUTH.ME)
    async me(
        @RequestActor() actor: any
    ) {
        const query = UserMeQuery.of(actor);

        return this.meUseCaseProxy
            .getInstance()
            .execute(query);
    }
}
