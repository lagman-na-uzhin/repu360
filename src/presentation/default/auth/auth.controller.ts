import {Body, Controller, Get, Inject, Post, UseGuards, Req, Res} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import {LoginDto} from "@presentation/default/employee/dto/login.dto";
import {UserLoginUseCase} from "@application/use-cases/default/employee/login/login.usecase";
import {EmployeeProxy} from "@infrastructure/usecase-proxy/employee/employee.proxy";
import {UserMeUseCase} from "@application/use-cases/default/employee/me/me.usecase";
import {UserInitQuery} from "@infrastructure/common/decorators/user.decorator";
import {EmployeeMeDto} from "@presentation/default/employee/dto/me.dto";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {LoginInput} from "@application/use-cases/default/employee/login/login.input";
import {EmployeeMeInput} from "@application/use-cases/default/employee/me/me.input";
import {ROUTES} from "@presentation/routes";

@Controller(ROUTES.AUTH.BASE)
export class EmployeeController {
    constructor(
        @Inject(EmployeeProxy.LOGIN_USE_CASE)
        private readonly userLoginUseCaseProxy: UseCaseProxy<UserLoginUseCase>,
        @Inject(EmployeeProxy.ME_USE_CASE)
        private readonly userMeUseCaseProxy: UseCaseProxy<UserMeUseCase>,
    ) {}

    @Post(ROUTES.AUTH.LOGIN)
    async login(
        @Body() payload: LoginDto,
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const input = LoginInput.of(payload.email, payload.password)

        const { employee, token, expireTime } = await this.userLoginUseCaseProxy
            .getInstance()
            .execute(input);

        reply.setCookie('Authentication', token, {
            httpOnly: true,
            path: '/',
            maxAge: Number(expireTime),
        });

        reply.status(200).send({
            statusCode: 200,
            data: employee,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(ROUTES.AUTH.ME)
    async me(@UserInitQuery() payload: EmployeeMeDto) {
        const input = EmployeeMeInput.of(payload.employee)

        return this.userMeUseCaseProxy
            .getInstance()
            .execute(input);
    }
}
