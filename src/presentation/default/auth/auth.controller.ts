import {Body, Controller, Inject, Post, Req, Res} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import {LoginDto} from "@presentation/default/employee/dto/login.dto";
import {UserLoginUseCase} from "@application/use-cases/default/employee/login/login.usecase";
import {EmployeeProxy} from "@infrastructure/usecase-proxy/employee/employee.proxy";
import {LoginInput} from "@application/use-cases/default/employee/login/login.input";
import {DEFAULT_ROUTES} from "@presentation/routes";

@Controller(DEFAULT_ROUTES.AUTH.BASE)
export class AuthController {
    constructor(
        @Inject(EmployeeProxy.LOGIN_USE_CASE)
        private readonly userLoginUseCaseProxy: UseCaseProxy<UserLoginUseCase>,
    ) {}

    @Post(DEFAULT_ROUTES.AUTH.LOGIN)
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
}
