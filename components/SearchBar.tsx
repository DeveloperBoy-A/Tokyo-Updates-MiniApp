"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
export default function SearchBar({
  placeholder = "Search movies, TV shows...",
}: {
  size?: "sm" | "md" | "lg";
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push("/movies?q=" + encodeURIComponent(q.trim()));
      }}
      className="flex items-center bg-neutral-900 rounded-lg border border-neutral-800 px-3 py-2.5"
    >
      <Search size={16} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none ml-2 w-full text-sm"
      />
    </form>
  );
}
