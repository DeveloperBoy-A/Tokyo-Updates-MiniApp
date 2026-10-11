import type { ReactNode } from "react";

export default function AdminPageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-black">{title}</h1>{description ? <p className="mt-1 text-sm text-neutral-400">{description}</p> : null}</div>{actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}</div>;
}
