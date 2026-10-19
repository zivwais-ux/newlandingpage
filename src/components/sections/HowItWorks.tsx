import { howItWorks } from "@/content/site";
import { Section } from "../Section";

export function HowItWorks() {
  return (
    <Section id="how" title={howItWorks.title} className="bg-sand">
      <ol className="grid gap-6 md:grid-cols-3">
        {howItWorks.steps.map((step, i) => (
          <li key={step.title} className="relative rounded-3xl bg-white p-7 shadow-sm">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-2xl font-extrabold text-white"
            >
              {i + 1}
            </span>
            <h3 className="mt-5 text-2xl font-bold text-ink">
              <span className="sr-only">שלב {i + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
