create extension if not exists "uuid-ossp";

create table public.profiles (
  id                    uuid references auth.users(id) on delete cascade primary key,
  username              text unique not null,
  display_name          text,
  bio                   text,
  avatar_url            text,
  niche                 text default 'musician' check (niche in ('musician','fitness','podcaster','artist','streamer')),
  plan                  text default 'free' check (plan in ('free','pro','creator')),
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create table public.links (
  id          uuid default uuid_generate_v4() primary key,
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  title       text not null,
  subtitle    text,
  url         text not null,
  icon        text default 'ti-link',
  position    integer default 0,
  is_featured boolean default false,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table public.analytics (
  id          uuid default uuid_generate_v4() primary key,
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  link_id     uuid references public.links(id) on delete set null,
  event_type  text not null check (event_type in ('page_view','link_click')),
  created_at  timestamptz default now()
);

alter table public.profiles  enable row level security;
alter table public.links     enable row level security;
alter table public.analytics enable row level security;

create policy "Profiles are publicly viewable" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create policy "Active links are publicly viewable" on public.links for select using (is_active = true);
create policy "Owners can insert links" on public.links for insert with check (auth.uid() = profile_id);
create policy "Owners can update links" on public.links for update using (auth.uid() = profile_id);
create policy "Owners can delete links" on public.links for delete using (auth.uid() = profile_id);

create policy "Anyone can insert analytics" on public.analytics for insert with check (true);
create policy "Owners can view analytics" on public.analytics for select using (auth.uid() = profile_id);

create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter int := 0;
begin
  base_username := regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g');
  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;
  insert into public.profiles (id, username, display_name) values (new.id, final_username, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace view public.analytics_summary as
select
  profile_id,
  count(*) filter (where event_type = 'page_view')  as total_views,
  count(*) filter (where event_type = 'link_click') as total_clicks,
  count(*) filter (where event_type = 'page_view' and created_at > now() - interval '7 days') as views_7d,
  count(*) filter (where event_type = 'link_click' and created_at > now() - interval '7 days') as clicks_7d
from public.analytics
group by profile_id;