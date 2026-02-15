-- Check total row count (bypassing RLS by running as postgres/admin)
SELECT count(*) FROM obituaries;

-- Check active RLS policies
SELECT * FROM pg_policies WHERE tablename = 'obituaries';

-- Check table structure again to match 'select *'
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'obituaries';
