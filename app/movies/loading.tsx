export default function MoviesLoading() {
  return <div className="space-y-6"><div className="h-8 w-56 rounded shimmer" /><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">{Array.from({ length: 18 }, (_, i) => <div key={i} className="aspect-[2/3] rounded-lg shimmer" />)}</div></div>;
}
