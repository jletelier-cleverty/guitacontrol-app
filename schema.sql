-- Finanzas Panel - Supabase Schema
-- Run this in Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  age int default 30,
  retire_age int default 65,
  monthly_spend int default 1500000,
  savings_goal int default 500000,
  return_rate numeric(5,2) default 8,
  uf numeric(10,2) default 38800,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Transactions
create table public.transactions (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  description text not null,
  amount int not null,
  type text not null check (type in ('gasto', 'ingreso')),
  source text not null,
  category text default '',
  month text not null,
  created_at timestamptz default now()
);

-- Rules
create table public.rules (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  keyword text not null,
  category text not null,
  created_at timestamptz default now()
);

-- Properties
create table public.properties (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text default 'propiedad',
  purchase_value numeric(12,2) default 0,
  current_value numeric(12,2) default 0,
  debt numeric(12,2) default 0,
  dividendo int default 0,
  years_left int default 0,
  appreciation numeric(5,2) default 5,
  rent int default 0,
  created_at timestamptz default now()
);

-- Goals (vision board)
create table public.goals (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  slot int not null check (slot >= 0 and slot <= 2),
  title text default '',
  value int default 0,
  image_url text default '',
  created_at timestamptz default now(),
  unique(user_id, slot)
);

-- Row Level Security (each user sees only their data)
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.rules enable row level security;
alter table public.properties enable row level security;
alter table public.goals enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);

create policy "Users can view own rules" on public.rules for select using (auth.uid() = user_id);
create policy "Users can insert own rules" on public.rules for insert with check (auth.uid() = user_id);
create policy "Users can update own rules" on public.rules for update using (auth.uid() = user_id);
create policy "Users can delete own rules" on public.rules for delete using (auth.uid() = user_id);

create policy "Users can view own properties" on public.properties for select using (auth.uid() = user_id);
create policy "Users can insert own properties" on public.properties for insert with check (auth.uid() = user_id);
create policy "Users can update own properties" on public.properties for update using (auth.uid() = user_id);
create policy "Users can delete own properties" on public.properties for delete using (auth.uid() = user_id);

create policy "Users can view own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_transactions_user_month on public.transactions(user_id, month);
create index idx_rules_user on public.rules(user_id);
create index idx_properties_user on public.properties(user_id);
create index idx_goals_user on public.goals(user_id);
