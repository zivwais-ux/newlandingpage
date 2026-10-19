import { about, primaryAction } from "@/content/site";
import { Fill } from "../Fill";
import { WhatsAppButton } from "../WhatsAppButton";

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__side">
        <h2 id="about-title" data-reveal>
          {about.title}
        </h2>
        <div className="about__portrait" data-reveal>
          {about.photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.photoSrc} alt={about.photoAlt} loading="lazy" />
          ) : (
            <Fill value="[למלא – תמונה אמיתית של זיו]" />
          )}
        </div>
      </div>
      <div className="about__blocks">
        {about.blocks.map((b, i) => (
          <div key={b.title} data-reveal style={{ "--d": i } as React.CSSProperties}>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </div>
        ))}
        <ul className="about__credentials" data-reveal aria-label="ניסיון והכשרה">
          {about.credentials.map((c) => (
            <li key={c}>
              <span className="dot" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
        <div data-reveal>
          <WhatsAppButton label={primaryAction} location="about" />
        </div>
      </div>
    </section>
  );
}
