-- Check columns in flower_offerings
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'flower_offerings';

-- Check constraints/foreign keys for flower_offerings
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'flower_offerings'::regclass;
