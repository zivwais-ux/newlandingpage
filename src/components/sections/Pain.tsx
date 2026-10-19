import { pain } from "@/content/site";
import { Section } from "../Section";

export function Pain() {
  return (
    <Section id="pain" title={pain.title} className="bg-sand">
      <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {pain.items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border-r-4 border-accent bg-white p-6 text-lg leading-relaxed text-ink shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-10 max-w-2xl text-center text-xl font-semibold text-ink sm:text-2xl">
        {pain.bridge}
      </p>
    </Section>
  );
}
