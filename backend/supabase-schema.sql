-- Run this once in Supabase SQL Editor.
create table if not exists public.records (
  id uuid primary key,
  collection text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists records_collection_idx on public.records (collection);
create index if not exists records_data_idx on public.records using gin (data);

-- The backend uses the service-role key and does not expose this table to the browser.
alter table public.records enable row level security;
