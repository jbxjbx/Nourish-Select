-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- CATEGORIES
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on categories for select using (true);


-- PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id),
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  is_subscription boolean default false,
  features text[], -- Array of strings for benefits (e.g. "Improves sleep")
  stock_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
create policy "Products are viewable by everyone." on products for select using (true);


-- CART
create table public.carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Nullable for guest carts (handled by local storage ID usually, but here we prefer auth)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.carts enable row level security;
create policy "Users can view their own cart" on carts for select using (auth.uid() = user_id);
create policy "Users can create their own cart" on carts for insert with check (auth.uid() = user_id);


-- CART ITEMS
create table public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  cart_id uuid references public.carts(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cart_items enable row level security;
create policy "Users can view their own cart items" on cart_items for select using (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);
create policy "Users can insert into their own cart" on cart_items for insert with check (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);
create policy "Users can update their own cart items" on cart_items for update using (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);
create policy "Users can delete their own cart items" on cart_items for delete using (
  exists (select 1 from public.carts where id = cart_items.cart_id and user_id = auth.uid())
);


-- REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id),
  user_id uuid references auth.users(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Authenticated users can create reviews" on reviews for insert with check (auth.role() = 'authenticated');


-- ANALYSIS LOGS (Tongue Analysis History)
create table public.analysis_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  image_url text, -- Path in Supabase Storage
  result_summary text, -- JSON or text summary of AI result
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analysis_logs enable row level security;
create policy "Users can view own analysis" on analysis_logs for select using (auth.uid() = user_id);
create policy "Users can create own analysis" on analysis_logs for insert with check (auth.uid() = user_id);


-- SEED DATA
-- Categories
insert into public.categories (name, slug, description) values
('Wellness Drinks', 'drinks', 'Herbal elixirs for body balance'),
('Foot Masks', 'foot-masks', 'Grounding treatments for your feet');

-- Products (Drinks)
-- Note: We use sub-queries to get category IDs dynamically
do $$
declare
  drinks_id uuid;
  masks_id uuid;
begin
  select id into drinks_id from public.categories where slug = 'drinks';
  select id into masks_id from public.categories where slug = 'foot-masks';

  insert into public.products (category_id, name, slug, description, price, is_subscription, features, image_url) values
  (drinks_id, 'Dream Weave Elixir', 'dream-weave', 'Enhances deep sleep and REM cycles.', 29.99, true, array['Improves Sleep', 'Deep Relaxation'], '/placeholder-drink-1.jpg'),
  (drinks_id, 'Calm Flow Tonic', 'calm-flow', 'Reduces anxiety and centers your Chi.', 34.99, true, array['Less Anxiety', 'Mental Clarity'], '/placeholder-drink-2.jpg'),
  (drinks_id, 'Vitality Spark', 'vitality-spark', 'Increases vigor and daily energy.', 24.99, true, array['Increase Vigor', 'Boost Appetite'], '/placeholder-drink-3.jpg');

  -- Products (Foot Masks)
  insert into public.products (category_id, name, slug, description, price, is_subscription, features, image_url) values
  (masks_id, 'Bamboo Detox Pad', 'bamboo-detox', 'Cures swollen feet with bamboo vinegar.', 19.99, false, array['Cure Swelling', 'Detox'], '/placeholder-mask-1.jpg'),
  (masks_id, 'Silk Exfoliator', 'silk-exfoliator', 'Gentle exfoliation for renewed skin.', 22.99, false, array['Exfoliating Scrub', 'Soft Skin'], '/placeholder-mask-2.jpg'),
  (masks_id, 'Acupressure Relief', 'acupressure-relief', 'Stimulates pressure points for whole-body healing.', 29.99, false, array['Pressure Points', 'Pain Relief'], '/placeholder-mask-3.jpg');
end $$;
