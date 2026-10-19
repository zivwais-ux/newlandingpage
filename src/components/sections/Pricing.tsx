import { pricing } from "@/content/site";
import { Fill } from "../Fill";
import { Icon } from "../Icons";
import { Section } from "../Section";

export function Pricing() {
  return (
    <Section id="pricing" title={pricing.title} subtitle={pricing.subtitle} className="bg-sand">
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {pricing.plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex flex-col rounded-3xl bg-white p-7 ${
              plan.highlight ? "shadow-xl ring-4 ring-accent md:-my-3" : "shadow-sm ring-1 ring-line"
            }`}
          >
            {plan.badge && (
              <p className="absolute -top-4 right-6 rounded-full bg-accent px-4 py-1 text-base font-bold text-white">
                {plan.badge}
              </p>
            )}
            <h3 className="text-2xl font-bold text-ink">{plan.name}</h3>
            <p className="mt-3 text-3xl font-extrabold text-ink">
              <Fill value={plan.price} />
            </p>
            <p className="mt-3 text-lg text-muted">{plan.desc}</p>
            <ul className="mt-5 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2 text-lg text-ink">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-3xl text-center text-lg">
        <Fill value={pricing.guarantee} />
      </p>
    </Section>
  );
}
