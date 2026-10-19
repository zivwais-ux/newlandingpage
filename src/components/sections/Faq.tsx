import { faq } from "@/content/site";
import { Section } from "../Section";

export function Faq() {
  return (
    <Section id="faq" title={faq.title}>
      <div className="mx-auto max-w-3xl space-y-4">
        {faq.items.map((item) => (
          <details key={item.q} className="group rounded-2xl bg-white shadow-sm ring-1 ring-line open:ring-accent">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 text-xl font-bold text-ink focus-visible:outline-4 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent-dark transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-6 pb-6 text-lg leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
