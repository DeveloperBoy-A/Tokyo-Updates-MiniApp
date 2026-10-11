import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tokyo-updates.vercel.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/", "/movies", "/tv", "/top250", "/compare", "/actors", "/quiz",
    "/blog", "/watchlist", "/about", "/contact", "/privacy", "/dmca", "/search"
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/movies" || route === "/tv" ? 0.9 : 0.5
  }));
}
