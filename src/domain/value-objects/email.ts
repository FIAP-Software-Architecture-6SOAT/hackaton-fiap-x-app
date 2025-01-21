export class Email {
  private readonly value: string;

  public constructor(value: string) {
    this.value = this.create(value);
  }

  private create(value: string): string {
    if (!this.isValid(value)) {
      throw new Error('Invalid email');
    }
    return value;
  }

  public getValue(): string {
    return this.value;
  }

  private isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
