import { createClient } from "../../supabase/client";
import { format } from "date-fns";

// Appointments API
export async function getAppointments() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      date,
      time,
      status,
      notes,
      services(id, name),
      clients:client_id(id, name, email, avatar_url),
      providers:provider_id(id, name, email, avatar_url)
    `,
    )
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return { data: null, error };
  }

  // Format the appointments data
  const formattedAppointments = data.map((appointment) => ({
    id: appointment.id,
    client: appointment.clients?.name || "Unknown Client",
    service: appointment.services?.name || "Unknown Service",
    date: format(new Date(appointment.date), "dd/MM/yyyy"),
    time: appointment.time.substring(0, 5), // Format as HH:MM
    status: appointment.status,
    notes: appointment.notes,
    clientId: appointment.clients?.id,
    providerId: appointment.providers?.id,
    clientAvatar: appointment.clients?.avatar_url,
    providerAvatar: appointment.providers?.avatar_url,
  }));

  return { data: formattedAppointments, error: null };
}

export async function createAppointment(appointmentData: {
  clientId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      client_id: appointmentData.clientId,
      provider_id: appointmentData.providerId,
      service_id: appointmentData.serviceId,
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status,
      notes: appointmentData.notes,
    })
    .select();

  return { data, error };
}

export async function updateAppointment(
  id: string,
  appointmentData: {
    clientId?: string;
    providerId?: string;
    serviceId?: string;
    date?: string;
    time?: string;
    status?: string;
    notes?: string;
  },
) {
  const supabase = createClient();

  const updateData: any = {};
  if (appointmentData.clientId) updateData.client_id = appointmentData.clientId;
  if (appointmentData.providerId)
    updateData.provider_id = appointmentData.providerId;
  if (appointmentData.serviceId)
    updateData.service_id = appointmentData.serviceId;
  if (appointmentData.date) updateData.date = appointmentData.date;
  if (appointmentData.time) updateData.time = appointmentData.time;
  if (appointmentData.status) updateData.status = appointmentData.status;
  if (appointmentData.notes !== undefined)
    updateData.notes = appointmentData.notes;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .update(updateData)
    .eq("id", id)
    .select();

  return { data, error };
}

export async function deleteAppointment(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  return { data, error };
}

// Services API
export async function getServices() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name", { ascending: true });

  return { data, error };
}

export async function createService(serviceData: {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  businessId?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("services")
    .insert({
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      business_id: serviceData.businessId,
    })
    .select();

  return { data, error };
}

export async function updateService(
  id: string,
  serviceData: {
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
    category?: string;
  },
) {
  const supabase = createClient();

  const updateData: any = {};
  if (serviceData.name) updateData.name = serviceData.name;
  if (serviceData.description !== undefined)
    updateData.description = serviceData.description;
  if (serviceData.duration) updateData.duration = serviceData.duration;
  if (serviceData.price) updateData.price = serviceData.price;
  if (serviceData.category !== undefined)
    updateData.category = serviceData.category;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("services")
    .update(updateData)
    .eq("id", id)
    .select();

  return { data, error };
}

export async function deleteService(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("services").delete().eq("id", id);

  return { data, error };
}

// Clients API
export async function getClients() {
  const supabase = createClient();

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "user")
    .order("name", { ascending: true });

  if (usersError) {
    console.error("Error fetching clients:", usersError);
    return { data: null, error: usersError };
  }

  // Get additional client data
  const userIds = users.map((user) => user.id);
  const { data: clientsData, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .in("id", userIds);

  if (clientsError) {
    console.error("Error fetching client details:", clientsError);
    return { data: users, error: null }; // Return just the users data if client details fail
  }

  // Count appointments for each client
  const { data: appointmentCounts, error: countError } = await supabase
    .from("appointments")
    .select("client_id, count")
    .in("client_id", userIds)
    .group("client_id");

  // Merge the data
  const clientsWithDetails = users.map((user) => {
    const clientDetails =
      clientsData?.find((client) => client.id === user.id) || {};
    const appointmentCount = appointmentCounts?.find(
      (count) => count.client_id === user.id,
    );

    return {
      id: user.id,
      name: user.name || user.full_name || "",
      email: user.email || "",
      phone: clientDetails.phone || "",
      lastAppointment: clientDetails.last_appointment
        ? format(new Date(clientDetails.last_appointment), "dd/MM/yyyy")
        : "",
      totalAppointments: appointmentCount
        ? parseInt(appointmentCount.count)
        : 0,
      avatar:
        user.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || user.email}`,
      notes: clientDetails.notes || "",
      address: clientDetails.address || "",
    };
  });

  return { data: clientsWithDetails, error: null };
}

export async function createClient(clientData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}) {
  // This would typically involve creating a user with the right role
  // and then adding the client-specific details
  // For now, we'll just return a mock response
  return {
    data: null,
    error: { message: "Creating clients requires admin access" },
  };
}

export async function updateClient(
  id: string,
  clientData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  },
) {
  const supabase = createClient();

  // Update the user record
  const userUpdateData: any = {};
  if (clientData.name) userUpdateData.name = clientData.name;
  if (clientData.email) userUpdateData.email = clientData.email;

  if (Object.keys(userUpdateData).length > 0) {
    const { error: userError } = await supabase
      .from("users")
      .update(userUpdateData)
      .eq("id", id);

    if (userError) {
      console.error("Error updating user data:", userError);
      return { data: null, error: userError };
    }
  }

  // Update the client-specific data
  const clientUpdateData: any = {};
  if (clientData.phone !== undefined) clientUpdateData.phone = clientData.phone;
  if (clientData.address !== undefined)
    clientUpdateData.address = clientData.address;
  if (clientData.notes !== undefined) clientUpdateData.notes = clientData.notes;
  clientUpdateData.updated_at = new Date().toISOString();

  if (Object.keys(clientUpdateData).length > 0) {
    // Check if client record exists
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("id", id)
      .single();

    if (existingClient) {
      // Update existing record
      const { data, error } = await supabase
        .from("clients")
        .update(clientUpdateData)
        .eq("id", id)
        .select();

      return { data, error };
    } else {
      // Create new record
      clientUpdateData.id = id;
      const { data, error } = await supabase
        .from("clients")
        .insert(clientUpdateData)
        .select();

      return { data, error };
    }
  }

  return { data: { id }, error: null };
}

// Business Hours API
export async function getBusinessHours(providerId?: string) {
  const supabase = createClient();

  let query = supabase
    .from("business_hours")
    .select("*")
    .order("day_of_week", { ascending: true });

  if (providerId) {
    query = query.eq("provider_id", providerId);
  }

  const { data, error } = await query;

  return { data, error };
}

export async function updateBusinessHours(
  id: string,
  hoursData: {
    startTime?: string;
    endTime?: string;
    isClosed?: boolean;
  },
) {
  const supabase = createClient();

  const updateData: any = {};
  if (hoursData.startTime !== undefined)
    updateData.start_time = hoursData.startTime;
  if (hoursData.endTime !== undefined) updateData.end_time = hoursData.endTime;
  if (hoursData.isClosed !== undefined)
    updateData.is_closed = hoursData.isClosed;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("business_hours")
    .update(updateData)
    .eq("id", id)
    .select();

  return { data, error };
}

// Users API (for providers)
export async function getProviders() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin", "business_admin"])
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching providers:", error);
    return { data: null, error };
  }

  const formattedProviders = data.map((provider) => ({
    id: provider.id,
    name: provider.name || provider.full_name || "",
    email: provider.email || "",
    role: provider.role,
    avatar:
      provider.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.name || provider.email}`,
  }));

  return { data: formattedProviders, error: null };
}
