-- Create tasks table
create table public.tasks (
  id uuid not null default uuid_generate_v4(),
  title text not null,
  completed boolean default false,
  user_id uuid not null,
  primary key (id)
);

-- Enable row level security
alter table public.tasks enable row level security;

-- Policies: allow owner to select/insert/update/delete their tasks
create policy "Allow logged-in users to select their tasks" on public.tasks
  for select using (auth.uid() = user_id);

create policy "Allow logged-in users to insert tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "Allow logged-in users to update their tasks" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Allow logged-in users to delete their tasks" on public.tasks
  for delete using (auth.uid() = user_id);
