-- Create a table for GPA calculations
CREATE TABLE public.gpa_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gpa DECIMAL(3,2) NOT NULL,
  total_credits INTEGER,
  semester_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gpa_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own calculations" 
ON public.gpa_calculations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calculations" 
ON public.gpa_calculations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations" 
ON public.gpa_calculations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_gpa_calculations_user_id ON public.gpa_calculations(user_id);
CREATE INDEX idx_gpa_calculations_created_at ON public.gpa_calculations(created_at DESC);