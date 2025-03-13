import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { UserRole, UserWithRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Plus, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ServicesPage() {
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

  // Fetch services from the database
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
  }

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Serviços</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Serviço
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Nome</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Categoria
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Duração</th>
                    <th className="py-3 px-4 text-left font-medium">Preço</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Descrição
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {services && services.length > 0 ? (
                    services.map((service) => (
                      <tr key={service.id} className="border-b">
                        <td className="py-3 px-4">{service.name}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block rounded-full px-2 py-1 text-xs font-medium bg-secondary">
                            {service.category || "Sem categoria"}
                          </span>
                        </td>
                        <td className="py-3 px-4 flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          {service.duration} min
                        </td>
                        <td className="py-3 px-4 flex items-center">
                          <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                          R$ {parseFloat(service.price).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          {service.description}
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
                              Excluir
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
                        Nenhum serviço encontrado.
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
