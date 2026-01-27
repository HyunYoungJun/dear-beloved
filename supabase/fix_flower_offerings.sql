-- 1. Ensure memorial_id is UUID (if it was text)
-- We attempt to cast it. If it fails, it means there is bad data.
BEGIN;

  -- First, check if type conversion is needed. safely.
  -- Note: If it's already UUID, this is harmless or we can skip.
  -- But to be safe and forceful as requested:
  ALTER TABLE public.flower_offerings 
  ALTER COLUMN memorial_id TYPE uuid USING memorial_id::uuid;

COMMIT;

-- 2. Update RLS Policy for SELECT
-- First, drop the permissive one if it exists
DROP POLICY IF EXISTS "Enable read access for all users" ON public.flower_offerings;

-- Create strict policy
CREATE POLICY "Enable read access for users to their own data"
ON public.flower_offerings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Also ensure INSERT policy is correct (already done but good to double check)
-- Existing: "Enable insert for authenticated users only" with check (auth.uid() = user_id) checks out.
