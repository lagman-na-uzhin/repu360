import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class EmployeePassword {
  private readonly value: string;

  constructor(password: string) {
    if (!this.isValid(password)) {
      throw new Error(EXCEPTION.EMPLOYEE.WEAK_PASSWORD);
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
