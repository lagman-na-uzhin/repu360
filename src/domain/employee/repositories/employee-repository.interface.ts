export interface IEmployeeRepository {
    emailIsExist(email: string): Promise<boolean>;
    phoneIsExist(phone: string): Promise<boolean>
}
