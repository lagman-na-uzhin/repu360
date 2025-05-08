import {Controller} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
@Controller(DEFAULT_ROUTES.EMPLOYEE.BASE)
export class EmployeeController {
    constructor(
    ) {}

}
