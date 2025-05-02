import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class ManagerPassword {
  private readonly value: string;

  constructor(password: string) {
    if (!this.isValid(password)) {
      throw new Error(EXCEPTION.MANAGER.WEAK_PASSWORD); //'Пароль должен содержать минимум 8 символов, хотя бы одну букву и цифру'
    }
    this.value = password;
  }

  private isValid(password: string): boolean {
    return true
    // return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  toString(): string {
    return this.value;
  }
}
