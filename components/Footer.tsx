import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2">
          <h3 className="gradient-text font-extrabold text-lg mb-2">
            🎬 Tokyo_Updates
          </h3>
          <p className="text-neutral-400 leading-relaxed">
            Discover trending movies, top-rated films, and honest reviews. All
            legal streaming links in one place.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3">Browse</h4>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <Link href="/movies">Movies</Link>
            </li>
            <li>
              <Link href="/tv">TV Shows</Link>
            </li>
            <li>
              <Link href="/blog">Reviews</Link>
            </li>
            <li>
              <Link href="/watchlist">Watchlist</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Legal</h4>
          <ul className="space-y-2 text-neutral-400">
            <li>Data by TMDB</li>
            <li>No hosting of movies</li>
            <li>Official watch links only</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Tokyo_Updates. Built with Next.js + TMDB.
      </div>
    </footer>
  );
}
