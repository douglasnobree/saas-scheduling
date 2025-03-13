import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { RecentClients } from "@/components/dashboard/recent-clients";
import { Calendar, Users, Clock, DollarSign } from "lucide-react";
import { UserRole, UserWithRole } from "@/types/roles";
import { format } from "date-fns";

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

  // Fetch upcoming appointments
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      date,
      time,
      status,
      services(id, name),
      clients:client_id(id, name, email, avatar_url)
    `,
    )
    .order("date", { ascending: true })
    .order("time", { ascending: true })
    .limit(5);

  if (appointmentsError) {
    console.error("Error fetching appointments:", appointmentsError);
  }

  // Format appointments
  const formattedAppointments = appointments
    ? appointments.map((appointment) => ({
        id: appointment.id,
        client: appointment.clients?.name || "Unknown Client",
        service: appointment.services?.name || "Unknown Service",
        date: format(new Date(appointment.date), "dd/MM/yyyy"),
        time: appointment.time.substring(0, 5), // Format as HH:MM
        status: appointment.status,
      }))
    : [];

  // Fetch recent clients
  const { data: clients, error: clientsError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(5);

  if (clientsError) {
    console.error("Error fetching clients:", clientsError);
  }

  // Format clients
  const formattedClients = clients
    ? clients.map((client) => ({
        id: client.id,
        name: client.name || client.full_name || "",
        email: client.email || "",
        lastAppointment: "", // We'll get this from the appointments table in a real implementation
        avatar:
          client.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name || client.email}`,
      }))
    : [];

  // Get dashboard stats
  const { data: appointmentCount } = await supabase
    .from("appointments")
    .select("id", { count: "exact" });

  const { data: clientCount } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .eq("role", "user");

  // Calculate total hours booked
  const { data: servicesWithAppointments } = await supabase.from("appointments")
    .select(`
      id,
      services(duration)
    `);

  const totalHours = servicesWithAppointments
    ? servicesWithAppointments.reduce((total, appointment) => {
        const duration = appointment.services?.duration || 0;
        return total + duration;
      }, 0) / 60 // Convert minutes to hours
    : 0;

  // Calculate monthly revenue (simplified)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;
  const endOfMonth = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`;

  const { data: monthlyAppointments } = await supabase
    .from("appointments")
    .select(
      `
      id,
      services(price)
    `,
    )
    .gte("date", startOfMonth)
    .lt("date", endOfMonth);

  const monthlyRevenue = monthlyAppointments
    ? monthlyAppointments.reduce((total, appointment) => {
        const price = parseFloat(appointment.services?.price || "0");
        return total + price;
      }, 0)
    : 0;

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Agendamentos"
            value={appointmentCount?.count?.toString() || "0"}
            icon={Calendar}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Clientes Ativos"
            value={clientCount?.count?.toString() || "0"}
            icon={Users}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Horas Reservadas"
            value={totalHours.toFixed(0)}
            icon={Clock}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Receita Mensal"
            value={`R$ ${monthlyRevenue.toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UpcomingAppointments appointments={formattedAppointments} />
          <RecentClients clients={formattedClients} />
        </div>
      </div>
    </DashboardLayout>
  );
}
