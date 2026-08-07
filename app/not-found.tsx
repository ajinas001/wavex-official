import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-dark px-6 text-center text-cream">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-sand">
        404
      </span>
      <h1 className="font-display text-5xl md:text-7xl text-cream italic">Page not found.</h1>
      <p className="max-w-md text-sand/80 font-body">
        The page you&apos;re looking for has moved, or never existed. Let&apos;s get
        you back to solid ground.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-cream px-8 py-4 text-sm font-body font-semibold text-dark transition-all duration-500 hover:bg-sand hover:text-dark"
      >
        Back to home
      </Link>
    </main>
  );
}
