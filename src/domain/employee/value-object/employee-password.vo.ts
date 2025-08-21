import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class EmployeePassword {
  private readonly _value: string;

  constructor(password: string) {
    if (!this.isValid(password)) {
      throw new Error(EXCEPTION.EMPLOYEE.WEAK_PASSWORD);
    }
    this._value = password;
  }

  static of(password: string) {
    return new EmployeePassword(password);
  }

  private isValid(password: string): boolean {
    return true
    // return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  toString(): string {
    return this._value;
  }
}
