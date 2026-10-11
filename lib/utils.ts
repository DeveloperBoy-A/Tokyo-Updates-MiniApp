import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export function formatRuntime(min?: number) {
  if (!min) return "—";
  const h = Math.floor(min / 60),
    m = min % 60;
  return h ? h + "h " + m + "m" : m + "m";
}
export function truncate(str: string, n = 160) {
  return str?.length > n ? str.slice(0, n) + "..." : str;
}
