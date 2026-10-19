import { testimonials } from "@/content/site";
import { Fill } from "../Fill";
import { Section } from "../Section";

// מוסתר עד שיש המלצות אמיתיות (testimonials.show ב-site.ts).
export function Testimonials() {
  if (!testimonials.show) return null;
  return (
    <Section id="testimonials" title={testimonials.title} className="testimonials">
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.items.map((t, i) => (
          <figure key={i} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-line">
            <blockquote className="text-xl leading-relaxed text-ink">
              <Fill value={t.quote} />
            </blockquote>
            <figcaption className="mt-4 text-lg text-muted">
              <Fill value={t.name} /> · <Fill value={t.business} />
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
