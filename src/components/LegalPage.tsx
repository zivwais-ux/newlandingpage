import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main" className="legal">
      <Link href="/" className="link">
        חזרה לדף הראשי
      </Link>
      <h1>{title}</h1>
      <div className="legal__body">{children}</div>
    </main>
  );
}
