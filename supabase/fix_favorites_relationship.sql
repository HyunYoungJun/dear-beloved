-- Ensure Foreign Key for user_favorites table
-- This script checks if the constraint exists, and if not, adds it.
-- It ensures 'article_id' correctly references 'obituaries(id)'.

DO $$ 
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_favorites_article_id_fkey' 
        AND table_name = 'user_favorites'
    ) THEN
        -- Add the constraint
        ALTER TABLE public.user_favorites
        ADD CONSTRAINT user_favorites_article_id_fkey
        FOREIGN KEY (article_id)
        REFERENCES public.obituaries(id)
        ON DELETE CASCADE;

        RAISE NOTICE 'Added Foreign Key constraint: user_favorites_article_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign Key constraint already exists: user_favorites_article_id_fkey';
    END IF;
END $$;

-- Verify columns for UI rendering
-- We confirm that 'obituaries' table has 'main_image_url' and 'title'.
-- No changes needed here, just documenting for verification.
