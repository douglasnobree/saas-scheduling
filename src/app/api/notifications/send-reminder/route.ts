import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";
import { NotificationType } from "@/types/notifications";

export async function POST(request: Request) {
  try {
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // In a real implementation, you would fetch the appointment details
    // and send notifications to both the client and service provider
    // For this example, we'll simulate sending a reminder

    // Fetch appointment details (mock data for now)
    const appointment = {
      id: appointmentId,
      client_id: "client-user-id", // This would come from your database
      provider_id: "provider-user-id", // This would come from your database
      service: "Consulta Médica",
      date: "2023-07-15",
      time: "14:30",
    };

    // Send notification to client
    await supabase.functions.invoke(
      "supabase-functions-send-email-notification",
      {
        body: {
          recipient: "client@example.com", // This would be the client's email
          subject: "Lembrete de Agendamento",
          content: `Olá! Este é um lembrete para seu agendamento de ${appointment.service} amanhã às ${appointment.time}.`,
          appointment_id: appointmentId,
          notification_type: NotificationType.APPOINTMENT_REMINDER,
        },
      },
    );

    // Create in-app notification for client
    await supabase.from("notifications").insert({
      user_id: appointment.client_id,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: "Lembrete de Agendamento",
      message: `Você tem um agendamento de ${appointment.service} amanhã às ${appointment.time}.`,
      appointment_id: appointmentId,
      read: false,
    });

    // Send notification to provider
    await supabase.functions.invoke(
      "supabase-functions-send-email-notification",
      {
        body: {
          recipient: "provider@example.com", // This would be the provider's email
          subject: "Lembrete de Agendamento",
          content: `Olá! Este é um lembrete para um agendamento de ${appointment.service} amanhã às ${appointment.time}.`,
          appointment_id: appointmentId,
          notification_type: NotificationType.APPOINTMENT_REMINDER,
        },
      },
    );

    // Create in-app notification for provider
    await supabase.from("notifications").insert({
      user_id: appointment.provider_id,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: "Lembrete de Agendamento",
      message: `Você tem um agendamento de ${appointment.service} amanhã às ${appointment.time}.`,
      appointment_id: appointmentId,
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 },
    );
  }
}
