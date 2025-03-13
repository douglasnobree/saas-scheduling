"use client";

import { UserRole } from "@/types/roles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Settings,
  BarChart,
  Home,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Início",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN, UserRole.USER],
    },
    {
      label: "Agendamentos",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard/agendamentos",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN, UserRole.USER],
    },
    {
      label: "Clientes",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/clientes",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN],
    },
    {
      label: "Serviços",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/servicos",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN],
    },
    {
      label: "Horários",
      icon: <Clock className="h-5 w-5" />,
      href: "/dashboard/horarios",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN],
    },
    {
      label: "Relatórios",
      icon: <BarChart className="h-5 w-5" />,
      href: "/dashboard/relatorios",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN],
    },
    {
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/configuracoes",
      roles: [UserRole.ADMIN, UserRole.BUSINESS_ADMIN, UserRole.USER],
    },
  ];

  const filteredRoutes = routes.filter((route) =>
    route.roles.includes(userRole),
  );

  return (
    <div className="h-full border-r bg-white flex flex-col overflow-y-auto w-64 shadow-sm">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-blue-100 p-1 rounded-md">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xl font-bold">AppointEase</span>
        </Link>
      </div>
      <div className="flex flex-col gap-1 px-2 py-2">
        {filteredRoutes.map((route) => (
          <Button
            key={route.href}
            variant={pathname === route.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2 px-4 py-6 h-auto",
              pathname === route.href
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50",
            )}
            asChild
          >
            <Link href={route.href}>
              {route.icon}
              <span>{route.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
