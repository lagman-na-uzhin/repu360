import {Body, Controller, Get, Inject, Post, UseGuards, Req, Res} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import {LoginDto} from "@presentation/default/user/dto/login.dto";
import {UserLoginUseCase} from "@application/use-cases/default/user/login/login.usecase";
import {UserProxy} from "@infrastructure/usecase-proxy/user/user.proxy";
import {UserMeUseCase} from "@application/use-cases/default/user/me/me.usecase";
import {UserInitQuery} from "@infrastructure/common/decorators/user.decorator";
import {UserMeDto} from "@presentation/default/user/dto/me.dto";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {LoginInput} from "@application/use-cases/default/user/login/login.input";
import {UserMeInput} from "@application/use-cases/default/user/me/me.input";
import {UserId} from "@domain/manager/manager";

@Controller('user')
export class UserController {
    constructor(
        @Inject(UserProxy.LOGIN_USE_CASE)
        private readonly userLoginUseCaseProxy: UseCaseProxy<UserLoginUseCase>,
        @Inject(UserProxy.ME_USE_CASE)
        private readonly userMeUseCaseProxy: UseCaseProxy<UserMeUseCase>,
    ) {}

    @Post('login')
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
    @Get('me')
    async me(@UserInitQuery() payload: UserMeDto) {
        return this.userMeUseCaseProxy
            .getInstance()
            .execute(new UserMeInput(new UserId(payload.authId)));
    }
}
