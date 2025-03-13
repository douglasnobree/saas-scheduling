import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Client {
  id: string;
  name: string;
  email: string;
  lastAppointment: string;
  avatar?: string;
}

interface RecentClientsProps {
  clients: Client[];
}

export function RecentClients({ clients }: RecentClientsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Nenhum cliente recente.
          </p>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <Avatar>
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback>
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.email}
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  {client.lastAppointment}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
