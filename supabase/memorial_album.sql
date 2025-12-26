-- 1. Create album_photos table
create table if not exists public.album_photos (
  id uuid not null default gen_random_uuid(),
  obituary_id uuid not null references public.obituaries(id) on delete cascade,
  image_url text not null,
  contributor_name text not null,
  description text,
  miss_you_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 2. Create photo_comments table
create table if not exists public.photo_comments (
  id uuid not null default gen_random_uuid(),
  photo_id uuid not null references public.album_photos(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 3. Enable RLS (Row Level Security)
alter table public.album_photos enable row level security;
alter table public.photo_comments enable row level security;

-- 4. Create Policies for album_photos
-- Policy: Everyone can view photos
create policy "Anyone can view album photos"
  on public.album_photos
  for select
  using ( true );

-- Policy: Everyone can insert photos (Public Upload)
create policy "Anyone can upload album photos"
  on public.album_photos
  for insert
  with check ( true );

-- Policy: Everyone can update miss_you_count (Simplification: Allow public update for 'Like' feature)
-- Note: In production, you might want a stricter RPC function for incrementing to prevent abuse, 
-- but for this requirement "Anyone can leave 'miss you'", direct update is the simplest MVP approach.
create policy "Anyone can update album photos"
  on public.album_photos
  for update
  using ( true );

-- 5. Create Policies for photo_comments
-- Policy: Everyone can view comments
create policy "Anyone can view photo comments"
  on public.photo_comments
  for select
  using ( true );

-- Policy: Everyone can add comments
create policy "Anyone can add photo comments"
  on public.photo_comments
  for insert
  with check ( true );

-- 6. Storage Bucket Setup (Instructional Comment)
-- You need to create a bucket named 'memorial_album' in the Supabase Storage Dashboard.
-- 1. Go to Storage > Buckets
-- 2. Click "New Bucket"
-- 3. Enter name: memorial_album
-- 4. Toggle "Public Bucket" to ON
-- 5. Save
-- 6. Add Policy for the bucket to allow public uploads:
--    (You can do this via UI "Policies" tab in Storage or run SQL below if your supabase extensions support it, 
--     but UI is often safer for storage policies)

-- Storage Policy SQL (Optional, if creating via SQL):
-- insert into storage.buckets (id, name, public) values ('memorial_album', 'memorial_album', true);
-- create policy "Public Access" 
--   on storage.objects for select 
--   using ( bucket_id = 'memorial_album' );
-- create policy "Public Upload" 
--   on storage.objects for insert 
--   with check ( bucket_id = 'memorial_album' );
