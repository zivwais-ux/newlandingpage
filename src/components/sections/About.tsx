import Image from "next/image";
import { about, primaryAction } from "@/content/site";
import { Fill } from "../Fill";
import { WhatsAppButton } from "../WhatsAppButton";

// עליי: כותרת גדולה, פסקה אחת קצרה ושלושה כרטיסי הכשרה. התעודה היא הכרטיס הגדול.
export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__side">
        <h2 id="about-title" data-reveal>
          {about.title}
        </h2>
        <div className={`about__portrait${about.photoSrc ? " about__portrait--photo" : ""}`} data-reveal>
          {about.photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.photoSrc} alt={about.photoAlt} width={900} height={1477} loading="lazy" />
          ) : (
            <Fill value="[למלא – תמונה אמיתית של זיו]" />
          )}
        </div>
      </div>
      <div className="about__main">
        <p className="about__lead" data-reveal>
          {about.lead}
        </p>
        <ul className="about__cards" aria-label="ניסיון והכשרה">
          {about.credentials.map((c, i) => (
            <li key={c.title} className={`about__card ${i === 0 ? "about__card--diploma" : ""}`} data-reveal>
              {/* the first card shows the real certificate; it opens full size */}
              {i === 0 && (
                <a href={about.diploma.src} target="_blank" rel="noopener" className="about__diploma" aria-label="פתיחת התעודה בגודל מלא">
                  <Image src={about.diploma.src} alt={about.diploma.alt} width={1400} height={991} loading="lazy" sizes="(min-width: 900px) 30vw, 90vw" />
                </a>
              )}
              <h3>{c.title}</h3>
              {c.text && <p>{c.text}</p>}
            </li>
          ))}
        </ul>
        <div>
          <WhatsAppButton label={primaryAction} location="about" />
        </div>
      </div>
    </section>
  );
}
