import Link from "next/link";
import { business, footer } from "@/content/site";
import { Fill } from "../Fill";

export function Footer() {
  return (
    <footer className="bg-ink px-4 pb-24 pt-8 text-cream/90 sm:px-6 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 border-t border-cream/20 pt-8 text-center text-base md:flex-row md:justify-between md:text-right">
        <p className="space-x-2 space-x-reverse">
          <Fill value={business.name} /> · <Fill value={business.phoneDisplay} /> · <Fill value={business.email} />
        </p>
        <nav aria-label="מידע משפטי" className="flex gap-6">
          <Link href="/accessibility" className="underline underline-offset-4 hover:text-white">
            {footer.accessibility}
          </Link>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-white">
            {footer.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
