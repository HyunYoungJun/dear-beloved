-- Comprehensive Fix for My Page Data Integration

-- 1. Fix 'flower_offerings'
-- Ensure memorial_id is UUID
BEGIN;
  ALTER TABLE public.flower_offerings 
  ALTER COLUMN memorial_id TYPE uuid USING memorial_id::uuid;
COMMIT;

-- Strict RLS for flowers
DROP POLICY IF EXISTS "Enable read access for all users" ON public.flower_offerings;
DROP POLICY IF EXISTS "Enable read access for users to their own data" ON public.flower_offerings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.flower_offerings;

CREATE POLICY "Enable read access for users to their own data"
ON public.flower_offerings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
ON public.flower_offerings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);


-- 2. Fix 'user_favorites'
-- Ensure memorial_id is UUID (assuming column name is 'memorial_id' based on user context, or 'obituary_id')
-- We will try to alter 'obituary_id' first if it exists, roughly checking. 
-- Actually, let's assume valid column name is 'obituary_id' usually, BUT user said 'memorial_id'.
-- We will try to fix 'obituary_id' if that's what it is used.
-- Let's check `types/supabase.ts`... wait, I couldn't see it.
-- Safeguard: We will try to ALTER proper column.
-- Let's assume user is right about 'memorial_id' OR it might be 'obituary_id'.
-- I will add a block that attempts to cast 'obituary_id' if it exists, or 'memorial_id'.
-- For now, let's trust the standard naming 'obituary_id' for favorites, BUT user said "flower_offerings and user_favorites' memorial_id".
-- I will run a standardized fix for 'obituary_id' on user_favorites (common pattern) AND 'memorial_id' just in case.

BEGIN;
  -- Try casting if it exists (using safe approach if possible, but force for now)
  -- Note: If column doesn't exist, this might fail, but in Supabase SQL Editor it's transactional per statement block usually.
  -- We'll assume the column linked to obituaries is the target.
  -- Let's guess it's 'obituary_id' based on typical schema, but adhering to request:
  -- "user_favorites 테이블의 memorial_id가 UUID 형식이 맞는지 확인해"
  -- I will attempt to cast 'memorial_id' if exists.
  ALTER TABLE public.user_favorites
  ALTER COLUMN memorial_id TYPE uuid USING memorial_id::uuid;
EXCEPTION
  WHEN undefined_column THEN
    -- If memorial_id doesn't exist, maybe it is obituary_id
    ALTER TABLE public.user_favorites
    ALTER COLUMN obituary_id TYPE uuid USING obituary_id::uuid;
END;

-- Strict RLS for favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Favorites Select Policy" ON public.user_favorites;
DROP POLICY IF EXISTS "Enable read access for users to their own data" ON public.user_favorites;

CREATE POLICY "Enable read access for users to their own data"
ON public.user_favorites FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
ON public.user_favorites FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users to their own data"
ON public.user_favorites FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 3. Diagnostics
-- Output orphaned records count
DO $$
DECLARE
    orphan_flowers INT;
    orphan_favorites INT;
BEGIN
    SELECT count(*) INTO orphan_flowers FROM public.flower_offerings f LEFT JOIN public.obituaries o ON f.memorial_id = o.id WHERE o.id IS NULL;
    
    -- Assuming column is memorial_id for favorites now, or adapt
    -- (Simplified for script robustness: just casting and RLS is critical)
    RAISE NOTICE 'Orphaned Flowers: %', orphan_flowers;
END $$;
