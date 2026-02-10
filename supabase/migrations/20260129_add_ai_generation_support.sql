-- Add ai_generated_content column to obituaries table
ALTER TABLE public.obituaries
ADD COLUMN IF NOT EXISTS ai_generated_content TEXT;

-- Create ai_generation_logs table for rate limiting
CREATE TABLE IF NOT EXISTS public.ai_generation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on ai_generation_logs
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can insert their own logs (handled by service role mostly, but good to have)
-- Actually, the edge function will likely use the service role key to write to this log to ensure it captures everything,
-- but if we use the user's client, we need insert policy.
-- Let's allow insert for authenticated users for now, but usually this is backend controlled.
CREATE POLICY "Enable insert for authenticated users" ON public.ai_generation_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own logs (optional, but good for debugging)
CREATE POLICY "Users can view their own logs" ON public.ai_generation_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Add index on created_at for faster rate limit queries
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON public.ai_generation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_ip ON public.ai_generation_logs(ip_address);
