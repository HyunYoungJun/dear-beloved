-- Add candle tracking columns to obituaries
ALTER TABLE obituaries 
ADD COLUMN last_candle_lit_at TIMESTAMPTZ,
ADD COLUMN candle_count INTEGER DEFAULT 0;
