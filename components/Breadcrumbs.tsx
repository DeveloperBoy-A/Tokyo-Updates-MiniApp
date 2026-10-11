import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Crumb = { label: string; href?: string };
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs = [{ label: "Home", href: "/" }, ...items];
  return <nav aria-label="Breadcrumb" className="mb-5 text-sm text-neutral-500"><ol className="flex flex-wrap items-center gap-2">{crumbs.map((item, index) => <li key={item.label + index} className="inline-flex items-center gap-2">{index > 0 ? <ChevronRight size={13} aria-hidden="true" /> : <Home size={14} aria-hidden="true" />}{item.href && index < crumbs.length - 1 ? <Link href={item.href} className="hover:text-white">{item.label}</Link> : <span aria-current={index === crumbs.length - 1 ? "page" : undefined} className={index === crumbs.length - 1 ? "text-neutral-200" : ""}>{item.label}</span>}</li>)}</ol></nav>;
}
