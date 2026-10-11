import { CalendarDays, Clock3, Globe2 } from "lucide-react";

export default function MovieMeta({ releaseDate, runtime, language }: { releaseDate?: string | null; runtime?: number | null; language?: string | null }) {
  const year = releaseDate?.slice(0, 4);
  const duration = typeof runtime === "number" && runtime > 0 ? (runtime >= 60 ? `${Math.floor(runtime / 60)}h ${runtime % 60 ? `${runtime % 60}m` : ""}`.trim() : `${runtime}m`) : null;
  const values = [{ icon: CalendarDays, text: year }, { icon: Clock3, text: duration }, { icon: Globe2, text: language?.toUpperCase() }].filter((item) => item.text);
  if (!values.length) return null;
  return <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400">{values.map(({ icon: Icon, text }) => <span key={text} className="inline-flex items-center gap-1.5"><Icon size={14} />{text}</span>)}</div>;
}
