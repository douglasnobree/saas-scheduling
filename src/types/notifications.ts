export enum NotificationType {
  APPOINTMENT_CREATED = "appointment_created",
  APPOINTMENT_UPDATED = "appointment_updated",
  APPOINTMENT_CANCELED = "appointment_canceled",
  APPOINTMENT_REMINDER = "appointment_reminder",
  APPOINTMENT_CONFIRMED = "appointment_confirmed",
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  appointment_id?: string;
  metadata?: Record<string, any>;
}
