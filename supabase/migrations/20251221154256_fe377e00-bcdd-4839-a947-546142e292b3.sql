-- Create a table to store the full calculator state for each user
CREATE TABLE public.calculator_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  state jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calculator_states ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own calculator state"
ON public.calculator_states
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculator state"
ON public.calculator_states
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculator state"
ON public.calculator_states
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_calculator_states_updated_at
BEFORE UPDATE ON public.calculator_states
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();