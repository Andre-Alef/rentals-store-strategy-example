export class NotificationError {
  constructor(
    public readonly message: string,
    public readonly context?: string,
  ) {}
}

export class Notification {
  private errors: NotificationError[] = [];

  addError(message: string, context?: string): void {
    this.errors.push(new NotificationError(message, context));
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): NotificationError[] {
    return this.errors;
  }

  getMessages(): string[] {
    return this.errors.map((error) => error.message);
  }
}
