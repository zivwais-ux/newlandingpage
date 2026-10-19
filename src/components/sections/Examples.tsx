import { examples } from "@/content/site";
import { Icon } from "../Icons";
import { Section } from "../Section";

export function Examples() {
  return (
    <Section id="examples" title={examples.title} subtitle={examples.subtitle}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {examples.cards.map((card) => (
          <article key={card.who} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-line">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-dark">
              <Icon name={card.icon} className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-ink">{card.who}</h3>
            <ul className="mt-4 flex-1 space-y-3">
              {card.items.map((item) => (
                <li key={item} className="flex gap-2 text-lg leading-snug text-ink">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-sand px-4 py-3 text-base font-semibold text-accent-dark">{card.saves}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-ink px-6 py-7 text-center text-cream sm:px-10">
        <h3 className="text-2xl font-bold">{examples.alsoFor.title}</h3>
        <p className="mt-3 text-lg leading-relaxed text-cream/90">{examples.alsoFor.text}</p>
      </div>
    </Section>
  );
}
