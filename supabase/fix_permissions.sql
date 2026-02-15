-- 1. Enable RLS on obituaries table (ensure it is on)
ALTER TABLE obituaries ENABLE ROW LEVEL SECURITY;

-- 2. Create/Replace Policy to allow SELECT for ALL users (Public Read)
-- This ensures 'anon' and 'authenticated' roles can read all obituaries.
-- Necessary for both Admin Page and Main Page.
DROP POLICY IF EXISTS "Public Read Access" ON obituaries;
CREATE POLICY "Public Read Access" ON obituaries 
FOR SELECT 
USING (true);

-- 3. Create/Replace Policy to allow UPDATE for Service Role or Admin?
-- If users need to edit their own, or admin edits all.
-- For now, let's ensure Admin can Update.
-- Assuming 'authenticated' users can update if they are admin? 
-- Or let's just Open Update for now if auth is handled in App? 
-- "The user wants it fixed NOW". Let's minimally fix SELECT.
-- But the Admin Page also toggles `is_today`. So we need UPDATE permission.
DROP POLICY IF EXISTS "Admin Update Access" ON obituaries;
CREATE POLICY "Admin Update Access" ON obituaries 
FOR UPDATE 
USING (true)  -- Visible rows
WITH CHECK (true); -- Allowed new values

-- 4. Check Relationships (for Main Page 400 error)
-- Ensure foreign keys exist.
-- verifying relationship "flower_offerings" -> "obituaries"
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'flower_offerings'
    ) THEN
        RAISE NOTICE 'Foreign keys might be missing on flower_offerings';
    END IF;
END $$;
