"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/client";
import {
  getUserNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notifications";
import { toast } from "@/components/ui/use-toast";

export function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    appointment_created: true,
    appointment_updated: true,
    appointment_canceled: true,
    appointment_reminder: true,
    appointment_confirmed: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { success, data } = await getUserNotificationPreferences(
        userData.user.id,
      );
      if (success && data) {
        setPreferences({
          appointment_created: data.appointment_created,
          appointment_updated: data.appointment_updated,
          appointment_canceled: data.appointment_canceled,
          appointment_reminder: data.appointment_reminder,
          appointment_confirmed: data.appointment_confirmed,
        });
      }
      setLoading(false);
    };

    fetchPreferences();
  }, [supabase]);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { success } = await updateNotificationPreferences(
      userData.user.id,
      preferences,
    );
    setSaving(false);

    if (success) {
      toast({
        title: "Preferências salvas",
        description:
          "Suas preferências de notificação foram atualizadas com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description:
          "Não foi possível salvar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse">Carregando...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment_created" className="font-medium">
                Novos Agendamentos
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações quando um novo agendamento for criado
              </p>
            </div>
            <Switch
              id="appointment_created"
              checked={preferences.appointment_created}
              onCheckedChange={() => handleToggle("appointment_created")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment_updated" className="font-medium">
                Atualizações de Agendamentos
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações quando um agendamento for atualizado
              </p>
            </div>
            <Switch
              id="appointment_updated"
              checked={preferences.appointment_updated}
              onCheckedChange={() => handleToggle("appointment_updated")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment_canceled" className="font-medium">
                Cancelamentos
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações quando um agendamento for cancelado
              </p>
            </div>
            <Switch
              id="appointment_canceled"
              checked={preferences.appointment_canceled}
              onCheckedChange={() => handleToggle("appointment_canceled")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment_reminder" className="font-medium">
                Lembretes
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes antes dos seus agendamentos
              </p>
            </div>
            <Switch
              id="appointment_reminder"
              checked={preferences.appointment_reminder}
              onCheckedChange={() => handleToggle("appointment_reminder")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appointment_confirmed" className="font-medium">
                Confirmações
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações quando um agendamento for confirmado
              </p>
            </div>
            <Switch
              id="appointment_confirmed"
              checked={preferences.appointment_confirmed}
              onCheckedChange={() => handleToggle("appointment_confirmed")}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4"
          >
            {saving ? "Salvando..." : "Salvar Preferências"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
