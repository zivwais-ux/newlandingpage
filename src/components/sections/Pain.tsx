import { pain, type PainIcon } from "@/content/site";
import { MacBook } from "../Chat";
import { PenMark } from "../PenMark";
import { WhatsAppButton } from "../WhatsAppButton";

const ICONS: Record<PainIcon, string> = {
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z",
  people: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6.5 6.5 0 0 1 3.5 6",
  note: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h6M9 16h4",
};

// "ספרו לי…" מסומן בעיגול בעט שנמתח בקצב הגלילה (בלי תמיכה או עם הפחתת תנועה הוא מצויר במלואו).
// הכאבים כהתראות טלפון שנערמות אחת על השנייה בזמן שהאזור מוחזק במסך.
export function Pain() {
  return (
    <section className="pain" aria-labelledby="pain-title">
      <div className="pain__stage">
        <div className="wrap pain__grid">
          <div className="pain__intro">
            <h2 id="pain-title" data-reveal>
              {pain.title}
            </h2>
            <p className="pain__answer">{pain.answer}</p>
            <p className="pain__cta">
              <span className="pain__mark">
                <WhatsAppButton label={pain.cta} location="pain" variant="text" />
                <PenMark kind="circle" className="pain__circle" />
              </span>
            </p>
          </div>
          {/* ההתראות על מסך של MacBook שעולה ונפתח בגלילה */}
          <div className="pain__device">
            <MacBook>
              <ul className="pain__stack" data-ui>
                {pain.items.map((item, i) => (
                  <li key={item.text} className="note" style={{ "--i": i } as React.CSSProperties}>
                    <div className="note__head" aria-hidden="true">
                      <span className="note__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d={ICONS[item.icon]} />
                        </svg>
                      </span>
                      <span className="note__app">{item.app}</span>
                      <span className="note__time">{item.time}</span>
                    </div>
                    <p className="note__text">{item.text}</p>
                  </li>
                ))}
              </ul>
            </MacBook>
          </div>
        </div>
      </div>
    </section>
  );
}
