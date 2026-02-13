-- Add is_today and is_editor_pick columns to obituaries table
ALTER TABLE obituaries 
ADD COLUMN IF NOT EXISTS is_today BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_editor_pick BOOLEAN DEFAULT FALSE;

-- Backfill data from biography_data JSONB column
-- Safe cast to boolean, defaulting to false if null or invalid
UPDATE obituaries 
SET 
  is_today = COALESCE((biography_data->>'is_today')::boolean, FALSE),
  is_editor_pick = COALESCE((biography_data->>'is_editor_pick')::boolean, FALSE);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_obituaries_is_today ON obituaries(is_today);
CREATE INDEX IF NOT EXISTS idx_obituaries_is_editor_pick ON obituaries(is_editor_pick);

-- Notify user to run this in Supabase SQL Editor
