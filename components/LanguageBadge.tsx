const labels: Record<string, string> = { en: "English", hi: "Hindi", ja: "Japanese", ko: "Korean", es: "Spanish", fr: "French", de: "German", ta: "Tamil", te: "Telugu", zh: "Chinese" };
export default function LanguageBadge({ code, label }: { code?: string | null; label?: string }) {
  if (!code?.trim() && !label?.trim()) return null;
  const key = code?.trim().toLowerCase() || "";
  return <span className="inline-flex rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-300">{label?.trim() || labels[key] || key.toUpperCase()}</span>;
}
