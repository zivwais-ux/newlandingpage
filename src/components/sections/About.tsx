import { about } from "@/content/site";
import { Fill } from "../Fill";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[280px_1fr]">
        <div className="mx-auto aspect-square w-56 overflow-hidden rounded-full bg-accent-soft ring-8 ring-white shadow-lg md:w-full">
          {about.photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.photoSrc} alt={about.photoAlt} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <Fill value="[למלא – תמונה אמיתית של זיו]" />
            </div>
          )}
        </div>
        <div>
          <h2 id="about-title" className="text-3xl font-extrabold text-ink sm:text-4xl">
            {about.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink sm:text-xl">
            {about.paragraphs.map((p) => (
              <p key={p}>
                <Fill value={p} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
