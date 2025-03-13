import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface Appointment {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  status: "agendado" | "confirmado" | "concluído" | "cancelado";
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "agendado":
        return "bg-blue-100 text-blue-800";
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "concluído":
        return "bg-purple-100 text-purple-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Nenhum agendamento próximo.
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{appointment.client}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.service}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {appointment.date} - {appointment.time}
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
