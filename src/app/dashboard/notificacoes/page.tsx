import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { UserRole, UserWithRole } from "@/types/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from "@/components/notifications/notification-settings";

export default async function NotificationsPage() {
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

  // Fetch recent notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Notificações</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                {!notifications || notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Você não tem notificações recentes.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-md ${!notification.read ? "bg-muted/20" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              notification.created_at,
                            ).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <NotificationSettings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
