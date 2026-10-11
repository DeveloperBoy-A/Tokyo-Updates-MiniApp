# 🎬 Tokyo_Updates

A legal movie discovery + review blog built with Next.js 14, TMDB API, and MDX.

## Features

- Trending, Popular, Top Rated, Now Playing, and Upcoming movie rows
- Search, genre, year, and sort filters
- TV shows and movie detail pages with trailers and legal providers
- Local-storage watchlist
- MDX review blog
- Dark responsive UI with neon styling
- Loading skeletons, error boundaries, 404, sitemap, robots, OpenGraph
- Optional GitHub Actions AI content generation

## Setup

```bash
npm install
cp .env.example .env.local
# Set TMDB_API_KEY in .env.local
npm run dev
```

Get a TMDB API key from https://www.themoviedb.org/settings/api.

## Deploy

Import this repository on Vercel and add the TMDB_API_KEY environment variable. Optionally set NEXT_PUBLIC_SITE_URL.

## Legal

This site does not host or stream movies. Metadata is supplied by TMDB and viewing links should direct users to official providers. This product uses the TMDB API but is not endorsed or certified by TMDB.
