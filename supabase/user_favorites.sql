-- Create user_favorites table for "Frequent Visits" (Bookmark) feature
create table if not exists public.user_favorites (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    article_id uuid not null references public.obituaries(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id),
    unique(user_id, article_id) -- Prevent duplicate bookmarks
);

-- Enable RLS
alter table public.user_favorites enable row level security;

-- Policies
create policy "Users can view their own favorites"
    on public.user_favorites for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own favorites"
    on public.user_favorites for insert
    with check ( auth.uid() = user_id );

create policy "Users can delete their own favorites"
    on public.user_favorites for delete
    using ( auth.uid() = user_id );
