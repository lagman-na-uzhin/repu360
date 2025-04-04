import {IUserRepository} from "@domain/manager/repositories/manager-repository.interface";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {UserMeInput} from "@application/use-cases/default/user/me/me.input";
import {Manager} from "@domain/manager/manager";
import {UserMeOutput} from "@application/use-cases/default/user/me/me.output";

export class UserMeUseCase {
    constructor(
        private readonly userRepo: IUserRepository
    ) {
    }
    async execute(input: UserMeInput): Promise<Manager> {
        const user = await this.userRepo.getById(input.authId.toString())

        if (!user) {
            throw new Error(EXCEPTION.USER.UNAUTHORIZED);
        }

        return new UserMeOutput(user.id.toString(), user.name.toString(), user.role, user.partnerId?.toString(), user.phone.toString(), user.permissions);
    }
}
