import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
        404
      </span>
      <h1 className="font-display text-5xl md:text-7xl">Page not found.</h1>
      <p className="max-w-md text-muted">
        The page you're looking for has moved, or never existed. Let's get
        you back to solid ground.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-ink px-8 py-4 text-sm text-bg transition-opacity hover:opacity-80"
      >
        Back to home
      </Link>
    </main>
  );
}
