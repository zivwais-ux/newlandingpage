import Link from "next/link";
import { business, footer, nav, primaryAction } from "@/content/site";
import { Fill } from "../Fill";
import { WhatsAppButton } from "../WhatsAppButton";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="mark">
          {[...nav.wordmark].map((ch, i) => (
            <div key={i}>
              <span aria-hidden="true">{ch}</span>
              <small>{nav.markLines[i]}</small>
            </div>
          ))}
        </div>
        <div className="footer__row">
          <ul>
            <li>{nav.tagline}</li>
            <li>
              <Fill value={business.name} />
            </li>
            <li>
              <Fill value={business.area} />
            </li>
          </ul>
          <ul>
            <li>
              <Fill value={business.phoneDisplay} />
            </li>
            <li>
              <Fill value={business.email} />
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
        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {nav.wordmark}
          </span>
          <WhatsAppButton label={primaryAction} location="footer" small />
        </div>
      </div>
    </footer>
  );
}
