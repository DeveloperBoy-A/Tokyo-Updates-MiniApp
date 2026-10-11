import type { ReactNode } from "react";

export default function AdminFormField({ label, htmlFor, hint, error, required, children }: { label: string; htmlFor?: string; hint?: string; error?: string; required?: boolean; children: ReactNode }) {
  return <div className="space-y-1.5"><label htmlFor={htmlFor} className="block text-sm font-semibold text-neutral-200">{label}{required ? <span className="ml-1 text-pink-400" aria-hidden="true">*</span> : null}</label>{children}{error ? <p role="alert" className="text-xs text-rose-400">{error}</p> : hint ? <p className="text-xs leading-5 text-neutral-500">{hint}</p> : null}</div>;
}
