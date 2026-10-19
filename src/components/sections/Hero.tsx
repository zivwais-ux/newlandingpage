import { hero } from "@/content/site";
import { HeroIllustration } from "../HeroIllustration";
import { Icon } from "../Icons";
import { WhatsAppButton } from "../WhatsAppButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="text-center md:text-right">
          <p className="inline-block rounded-full bg-accent-soft px-4 py-1.5 text-base font-semibold text-accent-dark">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] text-ink sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted sm:text-2xl">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col items-center gap-4 md:items-start">
            <WhatsAppButton label={hero.cta} location="hero" className="w-full sm:w-auto" />
            <a
              href="#contact"
              className="text-lg font-semibold text-accent-dark underline decoration-2 underline-offset-4 hover:text-ink"
            >
              {hero.secondary}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
            {hero.reassurance.map((r) => (
              <li key={r} className="flex items-center gap-2 text-lg text-ink">
                <Icon name="check" className="h-5 w-5 text-accent" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md md:max-w-none">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
