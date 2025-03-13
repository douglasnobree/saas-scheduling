"use client";

import { UserWithRole } from "@/types/roles";
import { UserCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface HeaderProps {
  user: UserWithRole;
}

export function Header({ user }: HeaderProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  return (
    <header className="border-b bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              className="pl-9 w-full bg-secondary/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name || "Usuário"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserCircle className="h-8 w-8" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.name || user.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/perfil")}
              >
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/configuracoes")}
              >
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/notificacoes")}
              >
                Notificações
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={handleSignOut}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
