import { finalCta } from "@/content/site";
import { LeadForm } from "../LeadForm";
import { WhatsAppButton } from "../WhatsAppButton";

export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink px-4 py-16 text-cream sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="text-center md:text-right">
          <h2 id="contact-title" className="text-4xl font-extrabold leading-tight sm:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-cream/90">{finalCta.text}</p>
          <WhatsAppButton label={finalCta.cta} location="final" className="mt-8 w-full sm:w-auto" />
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
