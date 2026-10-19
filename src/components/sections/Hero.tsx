import Image from "next/image";
import { hero, nav, primaryAction } from "@/content/site";
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
        <WhatsAppButton label={primaryAction} location="nav" small />
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
            <WhatsAppButton label={`${primaryAction} בוואטסאפ`} location="hero" />
            <span className="hero__note">{hero.note}</span>
          </div>
        </div>
        <div className="hero__shape">
          <Image
            src="/img/lesson.webp"
            alt={hero.photoAlt}
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 900px) 60vw, 100vw"
          />
        </div>
      </section>
    </header>
  );
}
