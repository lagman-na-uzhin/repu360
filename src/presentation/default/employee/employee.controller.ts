import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {UserInitQuery} from "@infrastructure/common/decorators/user.decorator";
import {EmployeeMeDto} from "@presentation/default/employee/dto/me.dto";
import {EmployeeMeInput} from "@application/use-cases/default/employee/me/me.input";
import {EmployeeProxy} from "@infrastructure/usecase-proxy/employee/employee.proxy";
import {UseCaseProxy} from "@infrastructure/usecase-proxy/usecase-proxy";
import {MeUseCase} from "@application/use-cases/default/employee/me/me.usecase";

@Controller(DEFAULT_ROUTES.EMPLOYEE.BASE)
export class EmployeeController {
    constructor(
        @Inject(EmployeeProxy.ME_USE_CASE)
        private readonly meUseCaseProxy: UseCaseProxy<MeUseCase>
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get(DEFAULT_ROUTES.EMPLOYEE.ME)
    async me(@UserInitQuery() payload: EmployeeMeDto) {
        const input = EmployeeMeInput.of(payload.role, payload.authId);

        return this.meUseCaseProxy
            .getInstance()
            .execute(input);
    }

}
