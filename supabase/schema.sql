-- V2A cloud sync: one complete app-state document per authenticated account.
-- Run this in the Supabase SQL Editor for your project.

create table if not exists public.v2a_user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.v2a_user_state enable row level security;

revoke all on public.v2a_user_state from anon;
grant select, insert, update, delete on public.v2a_user_state to authenticated;

drop policy if exists "Users can read their own V2A state" on public.v2a_user_state;
create policy "Users can read their own V2A state"
  on public.v2a_user_state for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own V2A state" on public.v2a_user_state;
create policy "Users can create their own V2A state"
  on public.v2a_user_state for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own V2A state" on public.v2a_user_state;
create policy "Users can update their own V2A state"
  on public.v2a_user_state for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own V2A state" on public.v2a_user_state;
create policy "Users can delete their own V2A state"
  on public.v2a_user_state for delete to authenticated
  using ((select auth.uid()) = user_id);
