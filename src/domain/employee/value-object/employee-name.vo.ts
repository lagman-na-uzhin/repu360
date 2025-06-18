import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class EmployeeName {
  private readonly value: string;

  constructor(name: string) {
    if (!this.isValid(name)) {
      throw new Error(EXCEPTION.EMPLOYEE.INVALID_NAME);
    }
    this.value = name;
  }

  private isValid(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }

  static of(name: string) {
    return new EmployeeName(name);
  }

  toString(): string {
    return this.value;
  }
}
