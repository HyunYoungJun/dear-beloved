-- Add incense tracking column to obituaries
ALTER TABLE obituaries 
ADD COLUMN incense_count INTEGER DEFAULT 0;
