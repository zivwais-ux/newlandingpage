import { testimonials } from "@/content/site";
import { Fill } from "../Fill";

// מוסתר עד שיש המלצות אמיתיות (testimonials.show ב-site.ts).
export function Testimonials() {
  if (!testimonials.show) return null;
  return (
    <section className="testimonials faq wrap" aria-labelledby="testimonials-title">
      <h2 id="testimonials-title">{testimonials.title}</h2>
      {testimonials.items.map((t, i) => (
        <figure key={i}>
          <blockquote>
            <Fill value={t.quote} />
          </blockquote>
          <figcaption>
            <Fill value={t.name} />, <Fill value={t.business} />
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
