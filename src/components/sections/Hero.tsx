import Image from "next/image";
import { hero, nav, navAction, primaryAction, whatsappMessage } from "@/content/site";
import { HeroBubble } from "../Chat";
import { WhatsAppButton } from "../WhatsAppButton";

export function Hero() {
  return (
    <header>
      <div className="wrap nav">
        <a href="#main" className="nav__mark">
          <b>{nav.wordmark}</b>
          <span>{nav.tagline}</span>
        </a>
        <nav aria-label="ניווט בדף" className="nav__links">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="link">
              {l.label}
            </a>
          ))}
        </nav>
        <WhatsAppButton label={navAction} location="nav" small />
      </div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <h1 id="hero-title">
            {hero.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero__sub">{hero.subtitle}</p>
          <div className="hero__actions">
            <WhatsAppButton label={primaryAction} location="hero" />
          </div>
          <ul className="hero__trust">
            {hero.trust.map((t) => (
              <li key={t}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
        {/* התמונה בחלון, משטח מרווה מתחתיה, והודעת הוואטסאפ שהגולש ישלח צפה על הפינה */}
        <div className="hero__media">
          <div className="hero__shape">
            <Image
              src="/img/lesson.webp"
              alt={hero.photoAlt}
              width={1536}
              height={1024}
              priority
              sizes="(min-width: 900px) 50vw, 100vw"
            />
          </div>
          <HeroBubble text={whatsappMessage} />
        </div>
      </section>
    </header>
  );
}
