import {Body, Controller, Get, Inject, Post, UseGuards, Req, Res} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import {LoginDto} from "@presentation/default/employee/dto/login.dto";
import {UserLoginUseCase} from "@application/use-cases/default/employee/login/login.usecase";
import {UserProxy} from "@infrastructure/usecase-proxy/user/user.proxy";
import {UserMeUseCase} from "@application/use-cases/default/employee/me/me.usecase";
import {UserInitQuery} from "@infrastructure/common/decorators/user.decorator";
import {UserMeDto} from "@presentation/default/employee/dto/me.dto";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {LoginInput} from "@application/use-cases/default/employee/login/login.input";
import {UserMeInput} from "@application/use-cases/default/employee/me/me.input";
import {ROUTES} from "@presentation/routes";
import {EmployeeId} from "@domain/employee/employee";

@Controller(ROUTES.EMPLOYEE.BASE)
export class EmployeeController {
    constructor(
        @Inject(UserProxy.LOGIN_USE_CASE)
        private readonly userLoginUseCaseProxy: UseCaseProxy<UserLoginUseCase>,
        @Inject(UserProxy.ME_USE_CASE)
        private readonly userMeUseCaseProxy: UseCaseProxy<UserMeUseCase>,
    ) {}

    @Post(ROUTES.EMPLOYEE.LOGIN)
    async login(
        @Body() payload: LoginDto,
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const { user, token, expireTime } = await this.userLoginUseCaseProxy
            .getInstance()
            .execute(new LoginInput(payload.email, payload.password));

        reply.setCookie('Authentication', token, {
            httpOnly: true,
            path: '/',
            maxAge: Number(expireTime),
        });

        reply.status(200).send({
            statusCode: 200,
            message: 'SUCCESS.USER.SUCCESS_LOGIN',
            data: user,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(ROUTES.EMPLOYEE.ME)
    async me(@UserInitQuery() payload: UserMeDto) {
        return this.userMeUseCaseProxy
            .getInstance()
            .execute(new UserMeInput(new EmployeeId(payload.authId)));
    }
}
