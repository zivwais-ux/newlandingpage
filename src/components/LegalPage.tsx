import Link from "next/link";
import { legalUpdated, type LegalDoc } from "@/content/legal";

// תבנית משותפת לתקנון, למדיניות הפרטיות ולהצהרת הנגישות: כותרת, תאריך עדכון, פתיחה וסעיפים.
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main id="main" className="legal">
      <Link href="/" className="link">
        חזרה לדף הראשי
      </Link>
      <h1>{doc.title}</h1>
      <p className="legal__date">עודכן לאחרונה: {legalUpdated}</p>
      <p className="legal__intro">{doc.intro}</p>
      <div className="legal__body">
        {doc.sections.map((s, i) => (
          <section key={s.heading} aria-labelledby={`legal-${i}`}>
            <h2 id={`legal-${i}`}>{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      <nav className="legal__more" aria-label="מסמכים נוספים">
        <Link href="/terms" className="link">
          תקנון
        </Link>
        <Link href="/privacy" className="link">
          מדיניות פרטיות
        </Link>
        <Link href="/accessibility" className="link">
          הצהרת נגישות
        </Link>
      </nav>
    </main>
  );
}
