
-- ... (existing tables)

-- 7. Testimonials Table (Dynamic)
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  client_name text not null,
  client_role text,
  content text not null,
  rating integer default 5,
  is_approved boolean default false,
  voucher_used text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Testimonial Vouchers (One-time use codes)
create table if not exists public.testimonial_vouchers (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  is_used boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Contact Submissions Log (Rate Limiting)
create table if not exists public.contact_submissions_log (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. ENABLE RLS
alter table public.testimonials enable row level security;
alter table public.testimonial_vouchers enable row level security;
alter table public.contact_submissions_log enable row level security;

-- 10. Security Policies
-- Public can read approved testimonials
create policy "Public read approved testimonials" on public.testimonials
  for select using (is_approved = true);

-- Public can insert a testimonial
create policy "Public insert testimonial" on public.testimonials
  for insert with check (true);

-- Vouchers can only be read/managed by admin
create policy "Admin manage vouchers" on public.testimonial_vouchers
  for all using (auth.role() = 'authenticated');

create policy "Admin manage testimonials" on public.testimonials
  for all using (auth.role() = 'authenticated');

-- Submission log policies
create policy "Public can insert submission log" on public.contact_submissions_log
  for insert with check (true);

create policy "Public can read submission log" on public.contact_submissions_log
  for select using (true);
