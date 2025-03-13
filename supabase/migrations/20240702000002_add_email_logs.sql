-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  appointment_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to update their own notifications
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  appointment_id UUID,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on email_logs table
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own email logs
DROP POLICY IF EXISTS "Users can view their own email logs" ON public.email_logs;
CREATE POLICY "Users can view their own email logs"
  ON public.email_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create email_notifications table for notification preferences
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  appointment_created BOOLEAN NOT NULL DEFAULT TRUE,
  appointment_updated BOOLEAN NOT NULL DEFAULT TRUE,
  appointment_canceled BOOLEAN NOT NULL DEFAULT TRUE,
  appointment_reminder BOOLEAN NOT NULL DEFAULT TRUE,
  appointment_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on email_notifications table
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own notification preferences
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.email_notifications;
CREATE POLICY "Users can view their own notification preferences"
  ON public.email_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to update their own notification preferences
DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.email_notifications;
CREATE POLICY "Users can update their own notification preferences"
  ON public.email_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
