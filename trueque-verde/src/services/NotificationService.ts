/**
 * Diseño simple (YAGNI): por ahora las notificaciones solo se guardan
 * en memoria para poder verificarlas en los tests de Cucumber.
 * Se podría reemplazar por email/push sin cambiar quien la consume.
 */
export interface Notification {
  userId: string;
  message: string;
}

export class NotificationService {
  private notifications: Notification[] = [];

  notify(userId: string, message: string): void {
    this.notifications.push({ userId, message });
  }

  hasNotification(userId: string): boolean {
    return this.notifications.some((n) => n.userId === userId);
  }

  clear(): void {
    this.notifications = [];
  }
}
