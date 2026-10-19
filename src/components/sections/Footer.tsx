import Link from "next/link";
import { business, footer, nav, primaryAction } from "@/content/site";
import { Fill } from "../Fill";
import { WhatsAppButton } from "../WhatsAppButton";

// בועת ההודעה: שלוש פינות מעוגלות, הפינה הימנית העליונה ישרה.
function bubble(x: number, w: number, h: number, r: number) {
  return `M${x + w} 0 V${h - r} A${r} ${r} 0 0 1 ${x + w - r} ${h} H${x + r} A${r} ${r} 0 0 1 ${x} ${h - r} V${r} A${r} ${r} 0 0 1 ${x + r} 0 Z`;
}

const W = 1200;
const H = 300;
const GAP = 12;
const letters = [...nav.wordmark];
const blockW = (W - GAP * (letters.length - 1)) / letters.length;
const fills = ["var(--mint)", "var(--bg)", "var(--mint)"];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cta">
          <h2 data-reveal>{footer.ctaTitle}</h2>
          <p data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            {footer.ctaText}
          </p>
          <div className="footer__actions" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <WhatsAppButton label={primaryAction} location="footer" variant="light" />
            <a href={`tel:+${business.whatsappNumber}`} className="link">
              או התקשרו: <span dir="ltr">{business.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <svg className="mark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${nav.wordmark}, ${nav.tagline}`}>
          {letters.map((ch, i) => {
            // RTL: האות הראשונה בבלוק הימני
            const x = W - (i + 1) * blockW - i * GAP;
            return (
              <g key={i}>
                <path d={bubble(x, blockW, H, 48)} fill={fills[i % fills.length]} />
                <text x={x + blockW / 2} y={H * 0.88} textAnchor="middle" className="mark__letter">
                  {ch}
                </text>
              </g>
            );
          })}
        </svg>

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
              <a href={`tel:+${business.whatsappNumber}`} className="link" dir="ltr">
                {business.phoneDisplay}
              </a>
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
        <p className="footer__bottom">
          © {new Date().getFullYear()} {nav.wordmark}, {nav.tagline}
        </p>
      </div>
    </footer>
  );
}
