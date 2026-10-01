-- IPHYGLAMOUR database schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create extension if not exists pgcrypto;

-- COLLECTIONS -------------------------------------------------------
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

alter table collections enable row level security;

create policy "Public can read collections"
  on collections for select
  using (true);

create policy "Admins can manage collections"
  on collections for all
  to authenticated
  using (true)
  with check (true);

-- PRODUCTS -------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  price numeric not null,
  category text,
  description text,
  fabric text,
  image_url text,
  image_urls jsonb default '[]'::jsonb,
  measurement_fields jsonb default '["bust","waist","hips","shoulder","sleeve_length","dress_length","armhole","thigh"]'::jsonb,
  available boolean default true,
  created_at timestamptz default now()
);

-- Safe to re-run: adds the newer columns if this table already existed
-- from an earlier version of this schema.
alter table products add column if not exists image_urls jsonb default '[]'::jsonb;
alter table products add column if not exists measurement_fields jsonb default '["bust","waist","hips","shoulder","sleeve_length","dress_length","armhole","thigh"]'::jsonb;

alter table products enable row level security;

create policy "Public can read available products"
  on products for select
  using (available = true);

create policy "Admins can read all products"
  on products for select
  to authenticated
  using (true);

create policy "Admins can manage products"
  on products for all
  to authenticated
  using (true)
  with check (true);

-- ORDERS ----------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text,
  phone text,
  items jsonb not null,
  total numeric not null,
  measurement_status text default 'awaiting_measurement',
  status text default 'New Order',
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Anyone can create an order"
  on orders for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can look up an order by order_number"
  on orders for select
  using (true);

create policy "Admins can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- MEASUREMENTS ------------------------------------------------------
create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  bust numeric,
  waist numeric,
  hips numeric,
  shoulder numeric,
  sleeve_length numeric,
  dress_length numeric,
  armhole numeric,
  thigh numeric,
  notes text,
  created_at timestamptz default now()
);

alter table measurements enable row level security;

create policy "Anyone can submit measurements"
  on measurements for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read measurements"
  on measurements for select
  to authenticated
  using (true);

-- APPOINTMENTS ------------------------------------------------------
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  type text check (type in ('home', 'shop')),
  customer_name text,
  phone text,
  address text,
  preferred_date date,
  preferred_time text,
  notes text,
  status text default 'requested',
  created_at timestamptz default now()
);

alter table appointments enable row level security;

create policy "Anyone can request an appointment"
  on appointments for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read and manage appointments"
  on appointments for all
  to authenticated
  using (true)
  with check (true);

-- STORAGE -------------------------------------------------------
-- After running this file, also create a Storage bucket named "products"
-- (Storage > New bucket > name: products > Public bucket: ON) so product
-- photos uploaded from the admin dashboard are viewable on the site.
