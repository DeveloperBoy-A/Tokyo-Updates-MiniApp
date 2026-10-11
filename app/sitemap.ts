import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://moviehub.vercel.app";
  return ["/", "/movies", "/tv", "/blog", "/watchlist"].map((p) => ({
    url: base + p,
    lastModified: new Date(),
    priority: p === "/" ? 1 : 0.8,
  }));
}
