import {PartnerUserRole} from "@domain/partner/model/partner-user/partner-user-role";

export class UserMeOutput {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly role: PartnerUserRole,
        public readonly partnerId: string,
        public readonly phone: string,
    ) {}
}
