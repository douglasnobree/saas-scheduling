import { UserWithRole } from "@/types/roles";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  user: UserWithRole;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="flex h-full">
        <Sidebar userRole={user.role} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
