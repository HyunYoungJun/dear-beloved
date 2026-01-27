-- Create reading_history table
CREATE TABLE IF NOT EXISTS public.reading_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    obituary_id uuid REFERENCES public.obituaries(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(user_id, obituary_id)
);

-- Enable RLS
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can read own history" ON public.reading_history;
CREATE POLICY "Users can read own history"
ON public.reading_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own history" ON public.reading_history;
CREATE POLICY "Users can insert own history"
ON public.reading_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own history" ON public.reading_history;
CREATE POLICY "Users can update own history"
ON public.reading_history FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
