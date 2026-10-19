import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/" className="text-lg font-semibold text-accent-dark underline underline-offset-4">
        → חזרה לדף הראשי
      </Link>
      <h1 className="mt-8 text-4xl font-extrabold text-ink">{title}</h1>
      <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink">{children}</div>
    </main>
  );
}
