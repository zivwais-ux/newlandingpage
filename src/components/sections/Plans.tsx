import { plans, primaryAction } from "@/content/site";
import { FlowWatch } from "../FlowWatch";
import { WhatsAppButton } from "../WhatsAppButton";

// ארבעת המסלולים כתהליך אוטומציה (כמו n8n): צמתים שמחוברים בקו. בגלילה הקו נמתח לצומת הבא,
// הצומת "נדלק" והפרטים שלו נפתחים (CSS בלבד; בלי תמיכה או עם הפחתת תנועה הכול פתוח).
const icons: Record<string, React.ReactNode> = {
  lesson: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  monthly: (
    <>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  build: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  manager: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
};

/** ההודעה המוכנה לכל מסלול: מתחילה כמו כל ההודעות באתר, ומוסיפה את שם המסלול. */
const planMessage = (name: string) => `היי זיו, הגעתי מהאתר. אשמח לשמוע על ${name}`;

export function Plans() {
  return (
    <section id="plans" className="plans wrap" aria-labelledby="plans-title">
      <div className="plans__head">
        <h2 id="plans-title" data-reveal>
          {plans.title}
        </h2>
        <p>{plans.subtitle}</p>
      </div>
      <FlowWatch>
        <ol className="flow__list">
          {plans.items.map((p, i) => (
            <li key={p.id} className={`flow__node flow__node--${p.id}`}>
              {i > 0 && (
                <span className="flow__wire" aria-hidden="true">
                  <i className="flow__pulse" />
                </span>
              )}
              <article className="flow__card">
                <div className="flow__main">
                  <div className="flow__top">
                    <span className="flow__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">{icons[p.id]}</svg>
                    </span>
                    <div>
                      <h3>{p.name}</h3>
                      <span className="flow__tag">{p.tag}</span>
                    </div>
                  </div>
                  <p className="flow__text flow__more">{p.text}</p>
                  <div className="flow__more">
                    <WhatsAppButton label={plans.cta} location={`plans-${p.id}`} message={planMessage(p.name)} small />
                  </div>
                </div>
                <div className="flow__side flow__more">
                  <p className="flow__label">{plans.includesLabel}</p>
                  <ul className="flow__includes">
                    {p.includes.map((line) => (
                      <li key={line}>
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M3 8.5l3 3 7-7" />
                        </svg>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="flow__label">{plans.forLabel}</p>
                  <p className="flow__for">{p.forWho}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </FlowWatch>
      <div className="plans__cta">
        <p>{plans.closing}</p>
        <WhatsAppButton label={primaryAction} location="plans" />
      </div>
    </section>
  );
}
