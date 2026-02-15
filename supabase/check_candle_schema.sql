-- Check constraints/foreign keys for candle_offerings
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'candle_offerings'::regclass;
