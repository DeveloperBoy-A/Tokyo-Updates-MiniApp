import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies, mediaType = "movie", href }: { title: string; movies: any[]; mediaType?: "movie" | "tv"; href?: string }) {
  if (!movies?.length) return null;
  return <section className="min-w-0"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold">{title}</h2>{href ? <Link href={href} className="inline-flex items-center gap-1 text-sm text-neon-pink hover:text-pink-300">See all <ChevronRight size={15} /></Link> : null}</div><div className="grid grid-flow-col auto-cols-[42%] gap-3 overflow-x-auto pb-3 sm:auto-cols-[28%] md:auto-cols-[21%] lg:auto-cols-[16%]">{movies.map((movie) => <MovieCard key={`${mediaType}-${movie.id}`} movie={movie} mediaType={mediaType} />)}</div></section>;
}
