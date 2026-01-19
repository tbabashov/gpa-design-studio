-- Create a table for user updates/notifications
CREATE TABLE public.user_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_updates ENABLE ROW LEVEL SECURITY;

-- Users can only see their own updates
CREATE POLICY "Users can view their own updates" 
ON public.user_updates 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update read status of their own updates
CREATE POLICY "Users can update their own updates" 
ON public.user_updates 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow insert for trigger function (service role only for welcome message)
CREATE POLICY "Allow system inserts" 
ON public.user_updates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_updates_user_id ON public.user_updates(user_id);
CREATE INDEX idx_user_updates_read ON public.user_updates(user_id, read);

-- Function to create welcome message for new users
CREATE OR REPLACE FUNCTION public.create_welcome_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_updates (user_id, title, message)
  VALUES (
    NEW.id,
    'Welcome to EasyGPA! 🎉',
    'We''re thrilled to have you here! EasyGPA is designed to make tracking your academic performance effortless and enjoyable. Start by adding your courses and assignments in the Calculator, and watch your GPA update in real-time. If you have any questions or feedback, don''t hesitate to reach out through our Contact page. Happy calculating!'
  );
  RETURN NEW;
END;
$function$;

-- Create trigger to send welcome message on user creation
CREATE TRIGGER on_auth_user_created_welcome
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_welcome_update();