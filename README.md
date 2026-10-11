# Tokyo_Updates

Tokyo_Updates is a dark, neon-accented movie discovery website built with Next.js 14 App Router, TypeScript, Tailwind CSS, TMDB, and Supabase. Public movie metadata comes from TMDB. Admin features use Supabase Auth, a server-side email allowlist, database tables, and Storage.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A TMDB API key
- A Supabase project for admin and database-backed features

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your credentials. Do not commit real keys.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

5. Follow [SETUP.md](./SETUP.md) to create the Supabase schema, configure Storage, and whitelist an admin email.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin |
| `TMDB_API_KEY` | TMDB API key used on the server |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only elevated Supabase key; never expose it to client components |
| `ADMIN_EMAILS` | Comma-separated administrator email allowlist |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Optional AdSense publisher client ID |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run typecheck` — TypeScript validation
- `npm run lint` — Next.js lint command

## Security notes

- Keep `.env.local` out of version control.
- Never use the Supabase service-role key in browser code.
- Configure Row Level Security (RLS) policies before using production data.
- Only add trusted addresses to `ADMIN_EMAILS` and the `admin_users` table.
- The website is intended to link to official streaming providers and display movie metadata, not to host copyrighted movies.

## Deployment

Import this repository into Vercel, configure the environment variables in Project Settings, and deploy. Apply the SQL and Storage configuration in [SETUP.md](./SETUP.md) before enabling admin workflows.
