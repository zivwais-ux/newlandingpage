import Link from "next/link";
import { business, footer, nav } from "@/content/site";
import { Fill } from "../Fill";
import { FooterComposer } from "../FooterComposer";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cta">
          <div>
            <h2 data-reveal>{footer.ctaTitle}</h2>
            <p>{footer.ctaText}</p>
            <a href={`tel:+${business.whatsappNumber}`} className="link footer__tel">
              או התקשרו: <span dir="ltr">{business.phoneDisplay}</span>
            </a>
          </div>
          <FooterComposer />
        </div>

        <p className="footer__mark">
          <b>{nav.wordmark}</b>
          <span>{nav.tagline}</span>
        </p>

        <div className="footer__row">
          <ul>
            <li>
              <Fill value={business.name} />
            </li>
            <li>
              <Fill value={business.area} />
            </li>
          </ul>
          <ul>
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
          </ul>
          <ul>
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
        </div>
        <p className="footer__bottom">
          © {new Date().getFullYear()} {nav.wordmark}, {nav.tagline}
        </p>
      </div>
    </footer>
  );
}
