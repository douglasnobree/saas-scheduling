"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment, updateAppointment, getServices, getClients, getProviders } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AppointmentFormProps {
  initialData?: {
    id?: string;
    clientId: string;
    providerId: string;
    serviceId: string;
    date: string;
    time: string;
    status: string;
    notes?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AppointmentForm({
  initialData,
  onSuccess,
  onCancel,
}: AppointmentFormProps) {
  const isEditing = !!initialData?.id;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    clientId: initialData?.clientId || "",
    providerId: initialData?.providerId || "",
    serviceId: initialData?.serviceId || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    status: initialData?.status || "agendado",
    notes: initialData?.notes || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Options for dropdowns
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        // Load services
        const { data: servicesData, error: servicesError } = await getServices();
        if (servicesError) throw new Error("Failed to load services");
        setServices(servicesData || []);
        
        // Load clients
        const { data: clientsData, error: clientsError } = await getClients();
        if (clientsError) throw new Error("Failed to load clients");
        setClients(clientsData || []);
        
        // Load providers
        const { data: providersData, error: providersError } = await getProviders();
        if (providersError) throw new Error("Failed to load providers");
        setProviders(providersData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load form options");
      } finally {
        setLoadingOptions(false);
      }
    };
    
    loadOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && initialData?.id) {
        // Update existing appointment
        const { error } = await updateAppointment(initialData.id, formData);
        if (error) throw new Error(error.message);
      } else {
        // Create new appointment
        const { error } = await createAppointment(formData);
        if (error) throw new Error(error.message);
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        router.push("/dashboard/agendamentos");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return <div className="p-4 text-center">Carregando opções...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleSelectChange("clientId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="providerId">Profissional</Label>
            <Select
              value={formData.providerId}
              onValueChange={(value) => handleSelectChange("providerId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceId">Serviço</Label>
          <Select
            value={formData.serviceId}
            onValueChange={(value) => handleSelectChange("serviceId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - R${parseFloat(service.price).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm