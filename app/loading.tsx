export default function Loading() {
  return (
    <main aria-label="Loading Tokyo_Updates" aria-busy="true" className="space-y-8">
      <div className="skeleton h-[360px] rounded-2xl sm:h-[460px]" />
      {[0, 1, 2].map((section) => (
        <section key={section} className="space-y-4">
          <div className="skeleton h-7 w-56 rounded-md" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((card) => (
              <div key={card} className="space-y-3">
                <div className="skeleton aspect-[2/3] rounded-xl" />
                <div className="skeleton h-4 w-4/5 rounded" />
                <div className="skeleton h-3 w-2/5 rounded" />
              </div>
            ))}
          </div>
        </section>
      ))}
      <span className="sr-only">Loading movie catalogue…</span>
    </main>
  );
}
