import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";
import { NotificationType } from "@/types/notifications";
import { addDays, format } from "date-fns";

// This endpoint would be called by a cron job to send appointment reminders
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = addDays(new Date(), 1);
    const tomorrowFormatted = format(tomorrow, "yyyy-MM-dd");

    // In a real implementation, you would fetch appointments scheduled for tomorrow
    // For this example, we'll simulate with mock data
    const mockAppointments = [
      {
        id: "appointment-1",
        client_id: "client-user-id-1",
        client_email: "client1@example.com",
        client_name: "Maria Silva",
        provider_id: "provider-user-id-1",
        provider_email: "provider1@example.com",
        provider_name: "Dr. João Santos",
        service: "Consulta Médica",
        date: tomorrowFormatted,
        time: "14:30",
      },
      {
        id: "appointment-2",
        client_id: "client-user-id-2",
        client_email: "client2@example.com",
        client_name: "Ana Oliveira",
        provider_id: "provider-user-id-2",
        provider_email: "provider2@example.com",
        provider_name: "Dra. Fernanda Lima",
        service: "Sessão de Fisioterapia",
        date: tomorrowFormatted,
        time: "10:00",
      },
    ];

    // Process each appointment and send reminders
    const results = await Promise.all(
      mockAppointments.map(async (appointment) => {
        // Send reminder to client
        const clientNotification = await supabase.from("notifications").insert({
          user_id: appointment.client_id,
          type: NotificationType.APPOINTMENT_REMINDER,
          title: "Lembrete de Agendamento",
          message: `Você tem um agendamento de ${appointment.service} amanhã às ${appointment.time}.`,
          appointment_id: appointment.id,
          read: false,
        });

        // Send email to client
        const clientEmail = await supabase.functions.invoke(
          "supabase-functions-send-email-notification",
          {
            body: {
              recipient: appointment.client_email,
              subject: "Lembrete de Agendamento",
              content: `Olá ${appointment.client_name}! Este é um lembrete para seu agendamento de ${appointment.service} amanhã às ${appointment.time} com ${appointment.provider_name}.`,
              appointment_id: appointment.id,
              notification_type: NotificationType.APPOINTMENT_REMINDER,
            },
          },
        );

        // Send reminder to provider
        const providerNotification = await supabase
          .from("notifications")
          .insert({
            user_id: appointment.provider_id,
            type: NotificationType.APPOINTMENT_REMINDER,
            title: "Lembrete de Agendamento",
            message: `Você tem um agendamento com ${appointment.client_name} amanhã às ${appointment.time} para ${appointment.service}.`,
            appointment_id: appointment.id,
            read: false,
          });

        // Send email to provider
        const providerEmail = await supabase.functions.invoke(
          "supabase-functions-send-email-notification",
          {
            body: {
              recipient: appointment.provider_email,
              subject: "Lembrete de Agendamento",
              content: `Olá ${appointment.provider_name}! Este é um lembrete para seu agendamento com ${appointment.client_name} amanhã às ${appointment.time} para ${appointment.service}.`,
              appointment_id: appointment.id,
              notification_type: NotificationType.APPOINTMENT_REMINDER,
            },
          },
        );

        return {
          appointment_id: appointment.id,
          client_notification: !clientNotification.error,
          provider_notification: !providerNotification.error,
          client_email: !clientEmail.error,
          provider_email: !providerEmail.error,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      message: `Sent reminders for ${results.length} appointments`,
      results,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 },
    );
  }
}
