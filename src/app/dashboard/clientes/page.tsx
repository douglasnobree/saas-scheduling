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

  // Mock data for clients
  const mockClients = [
    {
      id: "1",
      name: "Maria Silva",
      email: "maria.silva@exemplo.com",
      phone: "(11) 98765-4321",
      lastAppointment: "15/07/2023",
      totalAppointments: 8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      id: "2",
      name: "João Santos",
      email: "joao.santos@exemplo.com",
      phone: "(11) 91234-5678",
      lastAppointment: "10/07/2023",
      totalAppointments: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    },
    {
      id: "3",
      name: "Ana Oliveira",
      email: "ana.oliveira@exemplo.com",
      phone: "(11) 99876-5432",
      lastAppointment: "05/07/2023",
      totalAppointments: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    },
    {
      id: "4",
      name: "Carlos Mendes",
      email: "carlos.mendes@exemplo.com",
      phone: "(11) 95555-9999",
      lastAppointment: "01/07/2023",
      totalAppointments: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    },
    {
      id: "5",
      name: "Fernanda Lima",
      email: "fernanda.lima@exemplo.com",
      phone: "(11) 94444-8888",
      lastAppointment: "28/06/2023",
      totalAppointments: 7,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda",
    },
  ];

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
                  {mockClients.map((client) => (
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
                      <td className="py-3 px-4">{client.totalAppointments}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
