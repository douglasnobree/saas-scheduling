import { createClient } from "../../supabase/client";
import { NotificationType } from "@/types/notifications";

// Create a notification in the database
export async function createNotification({
  userId,
  type,
  title,
  message,
  appointmentId,
  metadata,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  appointmentId?: string;
  metadata?: Record<string, any>;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    appointment_id: appointmentId,
    metadata,
    read: false,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error creating notification:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// Send an email notification
export async function sendEmailNotification({
  recipient,
  subject,
  content,
  appointmentId,
  notificationType,
}: {
  recipient: string;
  subject: string;
  content: string;
  appointmentId?: string;
  notificationType: NotificationType;
}) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-send-email-notification",
      {
        body: {
          recipient,
          subject,
          content,
          appointment_id: appointmentId,
          notification_type: notificationType,
        },
      },
    );

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email notification:", error);
    return { success: false, error };
  }
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// Get user's notification preferences
export async function getUserNotificationPreferences(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("email_notifications")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error getting notification preferences:", error);
    return { success: false, error };
  }

  // If no preferences exist, create default preferences
  if (!data) {
    const { data: newPrefs, error: createError } = await supabase
      .from("email_notifications")
      .insert({
        user_id: userId,
        appointment_created: true,
        appointment_updated: true,
        appointment_canceled: true,
        appointment_reminder: true,
        appointment_confirmed: true,
      })
      .select("*")
      .single();

    if (createError) {
      console.error("Error creating notification preferences:", createError);
      return { success: false, error: createError };
    }

    return { success: true, data: newPrefs };
  }

  return { success: true, data };
}

// Update user's notification preferences
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    appointment_created?: boolean;
    appointment_updated?: boolean;
    appointment_canceled?: boolean;
    appointment_reminder?: boolean;
    appointment_confirmed?: boolean;
  },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("email_notifications")
    .update({
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating notification preferences:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// Helper function to check if a user should receive a notification of a specific type
export async function shouldSendEmailNotification(
  userId: string,
  type: NotificationType,
) {
  const { success, data, error } = await getUserNotificationPreferences(userId);

  if (!success || !data) {
    return true; // Default to sending if we can't determine preferences
  }

  switch (type) {
    case NotificationType.APPOINTMENT_CREATED:
      return data.appointment_created;
    case NotificationType.APPOINTMENT_UPDATED:
      return data.appointment_updated;
    case NotificationType.APPOINTMENT_CANCELED:
      return data.appointment_canceled;
    case NotificationType.APPOINTMENT_REMINDER:
      return data.appointment_reminder;
    case NotificationType.APPOINTMENT_CONFIRMED:
      return data.appointment_confirmed;
    default:
      return true;
  }
}

// Send appointment notification (creates in-app notification and sends email if enabled)
export async function sendAppointmentNotification({
  userId,
  type,
  title,
  message,
  emailSubject,
  emailContent,
  appointmentId,
  metadata,
  recipientEmail,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  emailSubject: string;
  emailContent: string;
  appointmentId?: string;
  metadata?: Record<string, any>;
  recipientEmail: string;
}) {
  // Create in-app notification
  const notificationResult = await createNotification({
    userId,
    type,
    title,
    message,
    appointmentId,
    metadata,
  });

  // Check if user has email notifications enabled for this type
  const shouldSendEmail = await shouldSendEmailNotification(userId, type);

  if (shouldSendEmail) {
    // Send email notification
    const emailResult = await sendEmailNotification({
      recipient: recipientEmail,
      subject: emailSubject,
      content: emailContent,
      appointmentId,
      notificationType: type,
    });

    return {
      notification: notificationResult,
      email: emailResult,
    };
  }

  return {
    notification: notificationResult,
    email: { success: true, skipped: true },
  };
}
