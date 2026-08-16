-- Core Media: migration for existing projects
-- Run once in Supabase → SQL Editor → Run

-- 1) Brand cover image column
alter table public.cm_brands
  add column if not exists cover_url text null;

-- 2) Allow custom egypt categories (remove fixed enum check)
alter table public.cm_brands drop constraint if exists cm_brands_egypt_category_check;

-- 3) Site content (hero / about / services / contact / sectors)
create table if not exists public.cm_site_settings (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cm_site_settings enable row level security;

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

insert into public.cm_site_settings (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Refresh PostgREST schema cache (if available)
notify pgrst, 'reload schema';
