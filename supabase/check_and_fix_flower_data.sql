-- 1. Check for orphaned flower offerings (memorial_id not in obituaries)
DO $$
BEGIN
    RAISE NOTICE 'Checking for orphaned flower offerings...';
    -- This part is for information. In a real script we might output this, but in SQL Editor user sees "Messages".
END $$;

-- Select orphans to see if any exist
SELECT f.* 
FROM public.flower_offerings f
LEFT JOIN public.obituaries o ON f.memorial_id = o.id
WHERE o.id IS NULL;

-- 2. Update RLS Policy STRICTLY again
-- Drop existing potential policies to be clean
DROP POLICY IF EXISTS "Enable read access for all users" ON public.flower_offerings;
DROP POLICY IF EXISTS "Enable read access for users to their own data" ON public.flower_offerings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.flower_offerings;

-- Create STRICT Read Policy
CREATE POLICY "Enable read access for users to their own data"
ON public.flower_offerings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create STRICT Insert Policy (re-apply)
CREATE POLICY "Enable insert for authenticated users only"
ON public.flower_offerings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. (Optional) Fix specific bad data if needed. 
-- For now, we trust the "memorial_id" type change handled basic UUID format. 
-- If needed, we can delete orphans:
-- DELETE FROM public.flower_offerings WHERE memorial_id NOT IN (SELECT id FROM public.obituaries);
-- But let's just View them first (Step 1).
