-- Core Media Supabase setup (run once)
-- 1) Open Supabase Dashboard → SQL Editor → New query
-- 2) Paste this whole file and Run

create table if not exists public.cm_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  market text not null check (market in ('saudi','egypt')),
  egypt_category text null,
  media jsonb not null default '[]'::jsonb,
  cover_url text null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- Safe for existing projects that already ran an older setup
alter table public.cm_brands add column if not exists cover_url text null;

create table if not exists public.cm_site_settings (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.cm_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.cm_brands enable row level security;
alter table public.cm_site_settings enable row level security;
alter table public.cm_admins enable row level security;

drop policy if exists "cm_brands_select_public" on public.cm_brands;
create policy "cm_brands_select_public"
on public.cm_brands for select
to anon, authenticated
using (true);

drop policy if exists "cm_brands_write_admins" on public.cm_brands;
create policy "cm_brands_write_admins"
on public.cm_brands for all
to authenticated
using (exists (select 1 from public.cm_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.cm_admins a where a.user_id = auth.uid()));

drop policy if exists "cm_site_settings_select_public" on public.cm_site_settings;
create policy "cm_site_settings_select_public"
on public.cm_site_settings for select
to anon, authenticated
using (true);

drop policy if exists "cm_site_settings_write_admins" on public.cm_site_settings;
create policy "cm_site_settings_write_admins"
on public.cm_site_settings for all
to authenticated
using (exists (select 1 from public.cm_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.cm_admins a where a.user_id = auth.uid()));

drop policy if exists "cm_admins_select_self" on public.cm_admins;
create policy "cm_admins_select_self"
on public.cm_admins for select
to authenticated
using (user_id = auth.uid());

-- Seed empty settings row (content filled from admin / frontend defaults)
insert into public.cm_site_settings (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Storage policies for bucket: cm-portfolio
drop policy if exists "cm_storage_public_read" on storage.objects;
create policy "cm_storage_public_read"
on storage.objects for select
to public
using (bucket_id = 'cm-portfolio');

drop policy if exists "cm_storage_admin_insert" on storage.objects;
create policy "cm_storage_admin_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cm-portfolio'
  and exists (select 1 from public.cm_admins a where a.user_id = auth.uid())
);

drop policy if exists "cm_storage_admin_update" on storage.objects;
create policy "cm_storage_admin_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cm-portfolio'
  and exists (select 1 from public.cm_admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'cm-portfolio'
  and exists (select 1 from public.cm_admins a where a.user_id = auth.uid())
);

drop policy if exists "cm_storage_admin_delete" on storage.objects;
create policy "cm_storage_admin_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'cm-portfolio'
  and exists (select 1 from public.cm_admins a where a.user_id = auth.uid())
);
