import {PartnerUserRole} from "@domain/employee/model/employee-role";

export class UserMeOutput {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly role: PartnerUserRole,
        public readonly partnerId: string,
        public readonly phone: string,
    ) {}
}
