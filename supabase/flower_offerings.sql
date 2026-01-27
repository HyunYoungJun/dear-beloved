-- Create flower_offerings table
create table public.flower_offerings (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null,
  memorial_id uuid not null,
  constraint flower_offerings_pkey primary key (id),
  constraint flower_offerings_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete cascade,
  constraint flower_offerings_memorial_id_fkey foreign KEY (memorial_id) references obituaries (id) on delete cascade,
  constraint flower_offerings_user_memorial_unique unique (user_id, memorial_id)
) tablespace pg_default;

-- Enable Row Level Security
alter table public.flower_offerings enable row level security;

-- Create Policies
-- Allow anyone to read (needed for counting)
create policy "Enable read access for all users"
on "public"."flower_offerings"
as PERMISSIVE
for SELECT
to public
using (true);

-- Allow authenticated users to insert their own offering
create policy "Enable insert for authenticated users only"
on "public"."flower_offerings"
as PERMISSIVE
for INSERT
to authenticated
with check (
  (auth.uid() = user_id)
);

-- Enable Realtime for this table
alter publication supabase_realtime add table public.flower_offerings;
