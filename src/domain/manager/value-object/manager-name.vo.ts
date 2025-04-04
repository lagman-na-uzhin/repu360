import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class ManagerName {
  private readonly value: string;

  constructor(name: string) {
    if (!this.isValid(name)) {
      throw new Error(EXCEPTION.USER.INVALID_NAME);
    }
    this.value = name;
  }

  private isValid(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }

  toString(): string {
    return this.value;
  }
}
