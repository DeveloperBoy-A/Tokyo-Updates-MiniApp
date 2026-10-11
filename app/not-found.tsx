import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-extrabold gradient-text mb-4">404</h1>
      <p className="text-neutral-400 mb-6">Ye page exist nahi karta bhai.</p>
      <Link
        href="/"
        className="bg-brand hover:bg-brand-dark px-6 py-2.5 rounded-lg font-semibold"
      >
        Go Home
      </Link>
    </div>
  );
}
