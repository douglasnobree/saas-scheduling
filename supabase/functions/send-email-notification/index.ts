import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient, subject, content, appointment_id, notification_type } =
      await req.json();

    if (!recipient || !subject || !content || !notification_type) {
      throw new Error("Missing required parameters");
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // In a production environment, you would integrate with an email service provider
    // like SendGrid, Mailgun, AWS SES, etc.
    // For this example, we'll just log the email and store it in the database

    console.log(
      `Sending email to ${recipient}:\nSubject: ${subject}\nContent: ${content}`,
    );

    // Get user ID from email if possible
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", recipient)
      .maybeSingle();

    // Log the email in the database
    const { data, error } = await supabase.from("email_logs").insert({
      user_id: userData?.id,
      recipient_email: recipient,
      subject,
      content,
      notification_type,
      appointment_id,
      status: "sent",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error sending email notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
