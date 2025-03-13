import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { RecentClients } from "@/components/dashboard/recent-clients";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import { UserRole, UserWithRole } from "@/types/roles";

export default async function Dashboard() {
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

  // Mock data for the dashboard
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
  ];

  const mockClients = [
    {
      id: "1",
      name: "Maria Silva",
      email: "maria.silva@exemplo.com",
      lastAppointment: "15/07/2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      id: "2",
      name: "João Santos",
      email: "joao.santos@exemplo.com",
      lastAppointment: "10/07/2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    },
    {
      id: "3",
      name: "Ana Oliveira",
      email: "ana.oliveira@exemplo.com",
      lastAppointment: "05/07/2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    },
  ];

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Agendamentos"
            value="128"
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Clientes Ativos"
            value="64"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Horas Reservadas"
            value="256"
            icon={Clock}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Receita Mensal"
            value="R$ 12.400"
            icon={DollarSign}
            trend={{ value: 10, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UpcomingAppointments appointments={mockAppointments} />
          <RecentClients clients={mockClients} />
        </div>
      </div>
    </DashboardLayout>
  );
}
