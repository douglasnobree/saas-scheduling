import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { UserRole, UserWithRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user data including role
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const userWithRole: UserWithRole = {
    id: user.id,
    email: user.email || "",
    role: (userData?.role as UserRole) || UserRole.USER,
    name: userData?.name || "",
    full_name: userData?.full_name || "",
    avatar_url: userData?.avatar_url || "",
  };

  // Mock data for appointments
  const mockAppointments = [
    {
      id: "1",
      client: "Maria Silva",
      service: "Consulta Médica",
      date: "15/07/2023",
      time: "14:30",
      status: "confirmado" as const,
    },
    {
      id: "2",
      client: "João Santos",
      service: "Corte de Cabelo",
      date: "16/07/2023",
      time: "10:00",
      status: "agendado" as const,
    },
    {
      id: "3",
      client: "Ana Oliveira",
      service: "Massagem Terapêutica",
      date: "16/07/2023",
      time: "16:45",
      status: "agendado" as const,
    },
    {
      id: "4",
      client: "Carlos Mendes",
      service: "Consulta Odontológica",
      date: "17/07/2023",
      time: "09:15",
      status: "agendado" as const,
    },
    {
      id: "5",
      client: "Fernanda Lima",
      service: "Sessão de Fisioterapia",
      date: "17/07/2023",
      time: "11:30",
      status: "confirmado" as const,
    },
  ];

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
          </Button>
        </div>

        <Tabs defaultValue="lista">
          <TabsList>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
          </TabsList>
          <TabsContent value="lista" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">
                          Cliente
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Serviço
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Data
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Horário
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAppointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b">
                          <td className="py-3 px-4">{appointment.client}</td>
                          <td className="py-3 px-4">{appointment.service}</td>
                          <td className="py-3 px-4">{appointment.date}</td>
                          <td className="py-3 px-4">{appointment.time}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                appointment.status === "confirmado"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "agendado"
                                    ? "bg-blue-100 text-blue-800"
                                    : appointment.status === "concluído"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendario" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendário de Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 border rounded-md">
                  <div className="flex flex-col items-center gap-4">
                    <Calendar className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Visualização de calendário será implementada em breve.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
