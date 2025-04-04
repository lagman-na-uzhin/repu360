export interface IPartnerUserRepository {
    emailIsExist(email: string): Promise<boolean>;
    phoneIsExist(phone: string): Promise<boolean>
}
