import {Controller} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {UserInitQuery} from "@infrastructure/common/decorators/user.decorator";
import {EmployeeMeDto} from "@presentation/default/employee/dto/me.dto";
import {EmployeeMeInput} from "@application/use-cases/default/employee/me/me.input";

@Controller(DEFAULT_ROUTES.EMPLOYEE.BASE)
export class EmployeeController {
    constructor(
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get(DEFAULT_ROUTES.EMPLOYEE.ME)
    async me(@UserInitQuery() payload: EmployeeMeDto) {
        const input = EmployeeMeInput.of(payload.employee)

        return this.userMeUseCaseProxy
            .getInstance()
            .execute(input);
    }

}
