import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { UserRole, UserWithRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
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

  return (
    <DashboardLayout user={userWithRole}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>

        <Tabs defaultValue="perfil">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="conta">Conta</TabsTrigger>
            {(userWithRole.role === UserRole.ADMIN ||
              userWithRole.role === UserRole.BUSINESS_ADMIN) && (
              <TabsTrigger value="negocio">Negócio</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="perfil" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      defaultValue={
                        userWithRole.full_name || userWithRole.name || ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userWithRole.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <Button>Salvar Alterações</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>Atualize sua foto de perfil.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {userWithRole.avatar_url ? (
                      <img
                        src={userWithRole.avatar_url}
                        alt="Foto de perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-muted-foreground">
                        {(
                          userWithRole.full_name ||
                          userWithRole.name ||
                          userWithRole.email
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline">Carregar Nova Foto</Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, GIF ou PNG. Tamanho máximo de 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conta" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha para manter sua conta segura.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirmar Nova Senha
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button>Atualizar Senha</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Gerencie como você recebe notificações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações sobre seus agendamentos por email.
                      </p>
                    </div>
                    <Button variant="outline">Ativado</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Lembretes de Agendamento</p>
                      <p className="text-sm text-muted-foreground">
                        Receba lembretes antes dos seus agendamentos.
                      </p>
                    </div>
                    <Button variant="outline">Ativado</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {(userWithRole.role === UserRole.ADMIN ||
            userWithRole.role === UserRole.BUSINESS_ADMIN) && (
            <TabsContent value="negocio" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Negócio</CardTitle>
                  <CardDescription>
                    Configure as informações do seu negócio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Nome do Negócio</Label>
                      <Input id="business-name" defaultValue="AppointEase" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email de Contato</Label>
                      <Input
                        id="business-email"
                        type="email"
                        defaultValue="contato@appointease.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">
                        Telefone de Contato
                      </Label>
                      <Input
                        id="business-phone"
                        defaultValue="(11) 3456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-address">Endereço</Label>
                      <Input
                        id="business-address"
                        defaultValue="Av. Paulista, 1000 - São Paulo, SP"
                      />
                    </div>
                  </div>
                  <Button>Salvar Alterações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Funcionamento</CardTitle>
                  <CardDescription>
                    Configure os horários em que seu negócio está aberto.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Segunda-feira",
                      "Terça-feira",
                      "Quarta-feira",
                      "Quinta-feira",
                      "Sexta-feira",
                      "Sábado",
                      "Domingo",
                    ].map((day) => (
                      <div
                        key={day}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <p className="font-medium">{day}</p>
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            defaultValue="09:00"
                            className="w-24"
                          />
                          <span>até</span>
                          <Input
                            type="time"
                            defaultValue="18:00"
                            className="w-24"
                          />
                          <Button variant="outline" size="sm">
                            Fechado
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button>Salvar Horários</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
