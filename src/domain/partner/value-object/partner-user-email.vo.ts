import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';

export class PartnerUserEmail {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(EXCEPTION.USER.INVALID_EMAIL);
    }
    this.value = email;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }
}
