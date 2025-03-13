import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { UserRole, UserWithRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function ClientsPage() {
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

  // Check if user has permission to access this page
  if (![UserRole.ADMIN, UserRole.BUSINESS_ADMIN].includes(userWithRole.role)) {
    return redirect("/dashboard");
  }

  // Fetch clients (users with role = 'user')
  const { data: clients, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "user")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching clients:", error);
  }

  // Get additional client data
  const clientIds = clients?.map((client) => client.id) || [];
  const { data: clientsData } = await supabase
    .from("clients")
    .select("*")
    .in("id", clientIds);

  // Count appointments for each client
  const { data: appointmentCounts } = await supabase
    .from("appointments")
    .select("client_id, count")
    .in("client_id", clientIds)
    .group("client_id");

  // Format client data
  const formattedClients = clients
    ? clients.map((client) => {
        const clientDetails =
          clientsData?.find((c) => c.id === client.id) || {};
        const appointmentCount = appointmentCounts?.find(
          (count) => count.client_id === client.id,
        );

        return {
          id: client.id,
          name: client.name || client.full_name || "",
          email: client.email || "",
          phone: clientDetails.phone || "",
          lastAppointment: clientDetails.last_appointment
            ? new Date(clientDetails.last_appointment).toLocaleDateString(
                "pt-BR",
              )
            : "",
          totalAppointments: appointmentCount
            ? parseInt(appointmentCount.count)
            : 0,
          avatar:
            client.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name || client.email}`,
        };
      })
    : [];

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-9 w-full"
                />
              </div>
              <Button variant="outline">Filtrar</Button>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Nome</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Telefone
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Último Agendamento
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Total de Agendamentos
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedClients.length > 0 ? (
                    formattedClients.map((client) => (
                      <tr key={client.id} className="border-b">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="h-8 w-8 rounded-full"
                          />
                          {client.name}
                        </td>
                        <td className="py-3 px-4">{client.email}</td>
                        <td className="py-3 px-4">{client.phone}</td>
                        <td className="py-3 px-4">{client.lastAppointment}</td>
                        <td className="py-3 px-4">
                          {client.totalAppointments}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-muted-foreground"
                      >
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
