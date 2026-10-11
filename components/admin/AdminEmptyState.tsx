import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminEmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-neutral-800 px-5 py-12 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-neutral-900 text-neutral-400"><Inbox size={22} /></span><h2 className="mt-4 font-bold">{title}</h2>{description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-400">{description}</p> : null}{action ? <div className="mt-5 flex justify-center">{action}</div> : null}</div>;
}
