export default function Loading() {
  return (
    <div className="space-y-8 py-10">
      <div className="h-72 rounded-xl shimmer" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-lg shimmer" />
        ))}
      </div>
    </div>
  );
}
