export class ManagerPhone {
  private readonly value: string;

  constructor(phone: string) {
    if (!this.isValid(phone)) {
      throw new Error('Некорректный номер телефона');
    }
    this.value = phone;
  }

  private isValid(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Поддержка международного формата E.164
    return phoneRegex.test(phone);
  }

  toString(): string {
    return this.value;
  }
}
