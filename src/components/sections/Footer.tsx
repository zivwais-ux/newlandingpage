import Link from "next/link";
import { build, business, footer, nav } from "@/content/site";
import { Fill } from "../Fill";
import { FooterComposer } from "../FooterComposer";
import { Logo } from "../Logo";

// פס של הכלים שבונים בשיעור (מתוך הדוגמאות באתר), שנע לאט. העותק השני רק משלים את הלולאה.
function ToolStrip() {
  const tools = build.examples.map((e) => e.tool);
  return (
    <div className="strip">
      <div className="strip__track">
        <ul className="strip__list" aria-label="דוגמאות לכלים שבונים בשיעור">
          {tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <ul className="strip__list" aria-hidden="true">
          {tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <ToolStrip />
      <div className="wrap">
        <div className="footer__cta">
          <div>
            <h2 data-reveal>{footer.ctaTitle}</h2>
            <p>{footer.ctaText}</p>
          </div>
          <FooterComposer />
        </div>

        <div className="footer__brand">
          <Logo className="footer__logo" />
          <span className="footer__tagline">{nav.tagline}</span>
        </div>

        <ul className="footer__row">
          <li>
            <Fill value={business.name} />
          </li>
          <li>
            <Fill value={business.area} />
          </li>
          <li>
            <a href={`tel:+${business.whatsappNumber}`} className="link" dir="ltr">
              {business.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${business.email}`} className="link" dir="ltr">
              {business.email}
            </a>
          </li>
          <li>
            <Link href="/accessibility" className="link">
              {footer.accessibility}
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="link">
              {footer.privacy}
            </Link>
          </li>
        </ul>
        <p className="footer__bottom">
          © {new Date().getFullYear()} {nav.wordmark}
        </p>
      </div>
    </footer>
  );
}
