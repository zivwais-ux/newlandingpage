import { about, primaryAction } from "@/content/site";
import { Fill } from "../Fill";
import { WhatsAppButton } from "../WhatsAppButton";

// עליי: כותרת גדולה, פסקה אחת קצרה ושלושה כרטיסי הכשרה. הדיפלומה היא הכרטיס הגדול.
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
          {about.credentials.map((c) => (
            <li key={c.title} className="about__card" data-reveal>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
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
