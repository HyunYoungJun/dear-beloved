-- Check constraints for candle_offerings
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'candle_offerings'::regclass;

-- Check constraints for user_favorites
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'user_favorites'::regclass;
