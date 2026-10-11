# Tokyo_Updates setup guide

This guide covers local setup, Supabase schema, admin access, and deployment.

## 1. Install and configure

Use Node.js 20+. Run:

```bash
npm install
cp .env.example .env.local
```

Set the values in `.env.local`. Obtain the TMDB API key from the API section of your TMDB account. In Supabase, copy the project URL, anon key, and service-role key from Project Settings → API. The service-role key is server-only and must never be prefixed with `NEXT_PUBLIC_`.

Example local environment:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TMDB_API_KEY=
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@tokyo.dev
```

## 2. Create database tables

Open Supabase Dashboard → SQL Editor and run the following SQL. The `users` table is represented by Supabase Auth's managed `auth.users`; do not create or modify that internal table directly.

```sql
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  tmdb_id integer unique,
  title text not null,
  slug text not null unique,
  year integer,
  overview text not null default '',
  poster text,
  backdrop text,
  rating numeric(3,1) not null default 0 check (rating >= 0 and rating <= 10),
  runtime integer,
  genres text[] not null default '{}',
  languages text[] not null default '{}',
  qualities text[] not null default '{}',
  download_links jsonb not null default '[]'::jsonb,
  watch_links jsonb not null default '[]'::jsonb,
  trailer_key text,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  views bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists movies_created_at_idx on public.movies (created_at desc);
create index if not exists movies_featured_idx on public.movies (featured) where featured = true;
create index if not exists movies_year_idx on public.movies (year desc);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover text,
  published boolean not null default false,
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.short_links (
  id uuid primary key default gen_random_uuid(),
  hash text not null unique,
  original_url text not null,
  clicks bigint not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ads_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text,
  country text,
  query text,
  movie_id uuid references public.movies(id) on delete set null,
  timestamp timestamptz not null default now()
);

create index if not exists analytics_timestamp_idx on public.analytics (timestamp desc);
create index if not exists analytics_path_idx on public.analytics (path);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null,
  bucket text not null check (bucket in ('media', 'posters', 'videos')),
  content_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  url text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.movies enable row level security;
alter table public.blog_posts enable row level security;
alter table public.short_links enable row level security;
alter table public.ads_config enable row level security;
alter table public.site_settings enable row level security;
alter table public.analytics enable row level security;
alter table public.uploads enable row level security;

-- Public read access is limited to published movies and published blog posts.
create policy "Public can read published movies" on public.movies
  for select to anon, authenticated using (status = 'published');
create policy "Public can read published blog posts" on public.blog_posts
  for select to anon, authenticated using (published = true);

-- Admin writes should be performed by trusted server routes using the service-role key
-- after validating the Supabase user and the ADMIN_EMAILS allowlist.
```

The service-role key bypasses RLS. Server routes must still validate the caller and should not expose that key in responses. If you need direct browser-side admin writes, implement explicit policies that check membership in `admin_users`; do not grant unrestricted writes.

## 3. Configure admin allowlist

1. In Supabase Authentication, create or invite the admin user with email/password.
2. Add that exact email to `ADMIN_EMAILS`, comma-separated if there are multiple admins.
3. Add the same address to the allowlist table:

   ```sql
   insert into public.admin_users (email)
   values ('admin@tokyo.dev')
   on conflict (email) do nothing;
   ```

4. The middleware protects `/admin/*` routes, except the login page. API endpoints must independently verify authentication and authorization; middleware alone is not API authorization.

## 4. Configure Storage buckets

In Supabase Dashboard → Storage, create these buckets:

- `media` — public bucket for general images and media metadata.
- `posters` — public bucket for movie posters and cover art.
- `videos` — private bucket for video files. Generate short-lived signed URLs when access is needed.

Recommended upload limits: images up to 10 MB; video files up to 500 MB. Restrict upload and delete operations to authenticated, authorized admins. Do not make the `videos` bucket public.

## 5. TMDB and legal configuration

Set `TMDB_API_KEY` server-side. Display TMDB attribution as required by TMDB's current terms. This project is for metadata discovery and official-provider links; do not upload or redistribute copyrighted movie files without authorization.

Set the real contact email in the legal pages and configure the site's canonical origin with `NEXT_PUBLIC_SITE_URL`.

## 6. Run and deploy

```bash
npm run typecheck
npm run dev
npm run build
npm run start
```

For Vercel, import the Git repository and set every production environment variable in Project Settings → Environment Variables. Apply the SQL first, create Storage buckets, and deploy. Use the `TokyoMovie` branch for this build until you are ready to merge it.
