import {Body, Controller, Inject, Post, Req, Res} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UseCaseProxy } from '@infrastructure/usecase-proxy/usecase-proxy';
import {EmployeeLoginDto, ManagerLoginDto} from "@presentation/default/auth/dto/login.dto";
import {EmployeeLoginUseCase} from "@application/use-cases/default/employee/login/login.usecase";
import {EmployeeProxy} from "@infrastructure/usecase-proxy/employee/employee.proxy";
import {EmployeeLoginCommand} from "@application/use-cases/default/employee/login/login.input";
import {DEFAULT_ROUTES} from "@presentation/routes";
import {ManagerLoginCommand} from "@application/use-cases/default/manager/login/login.input";
import {ManagerLoginUseCase} from "@application/use-cases/default/manager/login/login.usecase";
import {ManagerProxy} from "@infrastructure/usecase-proxy/manager/manager.proxy";

@Controller(DEFAULT_ROUTES.AUTH.BASE)
export class AuthController {
    constructor(
        @Inject(EmployeeProxy.LOGIN_USE_CASE)
        private readonly employeeLoginUseCaseProxy: UseCaseProxy<EmployeeLoginUseCase>,
        @Inject(ManagerProxy.LOGIN_USE_CASE)
        private readonly managerLoginUseCaseProxy: UseCaseProxy<ManagerLoginUseCase>,
    ) {}

    @Post(DEFAULT_ROUTES.AUTH.EMPLOYEE_LOGIN)
    async employeeLogin(
        @Body() dto: EmployeeLoginDto,
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        const cmd = EmployeeLoginCommand.of(dto)
        const { employee, token, expireTime } = await this.employeeLoginUseCaseProxy
            .getInstance()
            .execute(cmd);

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


    @Post(DEFAULT_ROUTES.AUTH.MANAGER_LOGIN)
    async managerLogin(
        @Body() dto: ManagerLoginDto,
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply
    ) {
        console.log(dto, "dto")
        const cmd = ManagerLoginCommand.of(dto)
        console.log(cmd,  "cmd")
        const { manager, token, expireTime } = await this.managerLoginUseCaseProxy
            .getInstance()
            .execute(cmd);

        reply.setCookie('Authentication', token, {
            httpOnly: true,
            path: '/',
            maxAge: Number(expireTime),
        });

        reply.status(200).send({
            statusCode: 200,
            data: manager,
        });
    }
}
