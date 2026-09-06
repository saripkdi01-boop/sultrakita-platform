-- SUKI Jobs: job portal schema for Sulawesi Tenggara.
create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
  logo_url text, cover_image_url text, description text, industry text,
  company_size text check (company_size in ('1-10','11-50','51-200','201-500','501-1000','1000+')),
  website text, location text, district text, city text default 'Kendari', province text default 'Sulawesi Tenggara',
  benefits text[] default '{}', is_verified boolean not null default false, rating numeric(3,2) not null default 0,
  total_reviews integer not null default 0, total_jobs integer not null default 0,
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(), company_id uuid references public.companies(id) on delete cascade,
  title text not null, slug text not null, description text not null, requirements text[] default '{}', responsibilities text[] default '{}',
  job_type text check (job_type in ('full_time','part_time','contract','freelance','internship')),
  work_type text check (work_type in ('onsite','remote','hybrid')),
  experience_level text check (experience_level in ('entry','mid','senior','manager','executive')),
  salary_min numeric(12,2), salary_max numeric(12,2), salary_currency text not null default 'IDR',
  salary_period text not null default 'monthly' check (salary_period in ('hourly','daily','monthly','yearly')),
  is_salary_hidden boolean not null default true, location text not null, district text, city text default 'Kendari', province text default 'Sulawesi Tenggara',
  is_remote boolean not null default false, benefits text[] default '{}', skills text[] default '{}', education_level text,
  application_deadline timestamptz, positions_available integer not null default 1, status text not null default 'draft' check (status in ('draft','published','closed','expired')),
  views_count integer not null default 0, applications_count integer not null default 0, is_featured boolean not null default false, featured_until timestamptz,
  published_at timestamptz, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(company_id, slug)
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(), job_id uuid not null references public.jobs(id) on delete cascade, applicant_id uuid not null references auth.users(id) on delete cascade,
  resume_url text, cover_letter text, status text not null default 'submitted' check (status in ('submitted','viewed','screening','interview','offered','accepted','rejected','withdrawn')),
  applied_at timestamptz not null default now(), viewed_at timestamptz, interviewed_at timestamptz, offered_at timestamptz, rejected_at timestamptz, notes text,
  unique(job_id, applicant_id)
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null, is_default boolean not null default false,
  personal_info jsonb default '{}'::jsonb, summary text, experiences jsonb[] default '{}', educations jsonb[] default '{}', skills text[] default '{}', certifications jsonb[] default '{}', languages jsonb[] default '{}', achievements text[] default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.company_reviews (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5), title text, pros text, cons text,
  work_life_balance_rating integer check (work_life_balance_rating between 1 and 5), salary_benefits_rating integer check (salary_benefits_rating between 1 and 5), job_security_rating integer check (job_security_rating between 1 and 5), management_rating integer check (management_rating between 1 and 5), culture_rating integer check (culture_rating between 1 and 5), is_anonymous boolean not null default false, created_at timestamptz not null default now(), unique(company_id, user_id)
);

create table if not exists public.salaries (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade, job_title text not null, salary_min numeric(12,2) not null, salary_max numeric(12,2) not null,
  salary_currency text not null default 'IDR', salary_period text not null default 'monthly', experience_level text, location text, is_anonymous boolean not null default false, submitted_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, job_id uuid not null references public.jobs(id) on delete cascade, saved_at timestamptz not null default now(), unique(user_id, job_id)
);

create table if not exists public.job_alerts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null, keywords text[] default '{}', locations text[] default '{}', job_types text[] default '{}', experience_levels text[] default '{}', salary_min numeric(12,2), salary_max numeric(12,2), is_active boolean not null default true, frequency text not null default 'daily' check (frequency in ('daily','weekly')), last_sent_at timestamptz, created_at timestamptz not null default now()
);

create index if not exists jobs_company_idx on public.jobs(company_id);
create index if not exists jobs_discovery_idx on public.jobs(status, published_at desc);
create index if not exists jobs_location_idx on public.jobs(city, district);
create index if not exists jobs_salary_idx on public.jobs(salary_min, salary_max);
create index if not exists jobs_title_description_idx on public.jobs using gin(to_tsvector('simple', title || ' ' || description));
create index if not exists applications_job_idx on public.job_applications(job_id);
create index if not exists applications_user_idx on public.job_applications(applicant_id);
create index if not exists resumes_user_idx on public.resumes(user_id);
create index if not exists reviews_company_idx on public.company_reviews(company_id);

alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.resumes enable row level security;
alter table public.company_reviews enable row level security;
alter table public.salaries enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.job_alerts enable row level security;

drop policy if exists jobs_public_read on public.jobs; create policy jobs_public_read on public.jobs for select to anon, authenticated using (status = 'published');
drop policy if exists companies_public_read on public.companies; create policy companies_public_read on public.companies for select to anon, authenticated using (true);
drop policy if exists companies_owner_insert on public.companies; create policy companies_owner_insert on public.companies for insert to authenticated with check (auth.uid() = created_by);
drop policy if exists jobs_owner_insert on public.jobs; create policy jobs_owner_insert on public.jobs for insert to authenticated with check (auth.uid() = created_by);
drop policy if exists applications_own_read on public.job_applications; create policy applications_own_read on public.job_applications for select to authenticated using (auth.uid() = applicant_id);
drop policy if exists applications_own_insert on public.job_applications; create policy applications_own_insert on public.job_applications for insert to authenticated with check (auth.uid() = applicant_id);
drop policy if exists resumes_own_all on public.resumes; create policy resumes_own_all on public.resumes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists reviews_public_read on public.company_reviews; create policy reviews_public_read on public.company_reviews for select to anon, authenticated using (true);
drop policy if exists reviews_own_insert on public.company_reviews; create policy reviews_own_insert on public.company_reviews for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists salaries_public_read on public.salaries; create policy salaries_public_read on public.salaries for select to anon, authenticated using (true);
drop policy if exists salaries_own_insert on public.salaries; create policy salaries_own_insert on public.salaries for insert to authenticated with check (auth.uid() = submitted_by);
drop policy if exists saved_jobs_own_all on public.saved_jobs; create policy saved_jobs_own_all on public.saved_jobs for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists alerts_own_all on public.job_alerts; create policy alerts_own_all on public.job_alerts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.touch_suki_jobs_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists companies_updated_at on public.companies; create trigger companies_updated_at before update on public.companies for each row execute function public.touch_suki_jobs_updated_at();
drop trigger if exists jobs_updated_at on public.jobs; create trigger jobs_updated_at before update on public.jobs for each row execute function public.touch_suki_jobs_updated_at();
drop trigger if exists resumes_updated_at on public.resumes; create trigger resumes_updated_at before update on public.resumes for each row execute function public.touch_suki_jobs_updated_at();

create or replace function public.update_suki_jobs_company_totals() returns trigger language plpgsql security definer set search_path = public as $$ begin if tg_op = 'INSERT' and new.status = 'published' then update companies set total_jobs = total_jobs + 1 where id = new.company_id; elsif tg_op = 'DELETE' and old.status = 'published' then update companies set total_jobs = greatest(total_jobs - 1, 0) where id = old.company_id; end if; return null; end; $$;
drop trigger if exists jobs_company_totals on public.jobs; create trigger jobs_company_totals after insert or delete on public.jobs for each row execute function public.update_suki_jobs_company_totals();

create or replace function public.update_suki_jobs_company_rating() returns trigger language plpgsql security definer set search_path = public as $$ begin update companies set rating = coalesce((select avg(rating)::numeric(3,2) from company_reviews where company_id = coalesce(new.company_id, old.company_id)), 0), total_reviews = (select count(*) from company_reviews where company_id = coalesce(new.company_id, old.company_id)) where id = coalesce(new.company_id, old.company_id); return coalesce(new, old); end; $$;
drop trigger if exists company_reviews_rating on public.company_reviews; create trigger company_reviews_rating after insert or update or delete on public.company_reviews for each row execute function public.update_suki_jobs_company_rating();
