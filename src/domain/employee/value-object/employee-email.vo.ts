import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class EmployeeEmail {
  private readonly _value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(EXCEPTION.EMPLOYEE.INVALID_EMAIL);
    }
    this._value = email;
  }

  static of(email: string) {
    return new EmployeeEmail(email);
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this._value;
  }
}
