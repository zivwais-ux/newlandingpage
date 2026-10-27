"use client";

import { useRef, useState } from "react";
import { plans, primaryAction } from "@/content/site";
import { PenMark } from "../PenMark";
import { WhatsAppButton } from "../WhatsAppButton";

// ארבעת המסלולים כמו תהליך שזיו משרטט במחברת: שמות גדולים בתוך תיבות שצוירו בעט, וחצים ביניהן.
// בגלילה העט מצייר תיבה, חץ, תיבה. המסלול שנבחר מסומן בטוש, והפרטים שלו נפתחים בשדה הירוק שמתחת.

/** ההודעה המוכנה לכל מסלול: מתחילה כמו כל ההודעות באתר, ומוסיפה את שם המסלול. */
const planMessage = (name: string) => `היי זיו, הגעתי מהאתר. אשמח לשמוע על ${name}`;

export function Plans() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = plans.items.length;
    const step = { ArrowLeft: 1, ArrowDown: 1, ArrowRight: -1, ArrowUp: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = (i + step + n) % n;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="plans" className="plans wrap" aria-labelledby="plans-title">
      <div className="plans__head">
        <h2 id="plans-title" data-reveal>
          {plans.title}
        </h2>
        <p>{plans.subtitle}</p>
      </div>
      <ol className="sketch" role="tablist" aria-label={plans.title}>
        {plans.items.map((p, i) => (
          <li key={p.id} className="sketch__step" role="presentation">
            {i > 0 && <PenMark kind="arrow" className="sketch__arrow" />}
            <button
              ref={(b) => {
                tabs.current[i] = b;
              }}
              type="button"
              role="tab"
              id={`plan-tab-${p.id}`}
              aria-selected={active === i}
              aria-controls={`plan-panel-${p.id}`}
              tabIndex={active === i ? 0 : -1}
              className="sketch__node"
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="sketch__name">
                {p.name}
                <PenMark kind="box" className="sketch__box" />
              </span>
              <span className="sketch__tag">{p.tag}</span>
            </button>
          </li>
        ))}
      </ol>
      {plans.items.map((p, i) => (
        <div
          key={p.id}
          id={`plan-panel-${p.id}`}
          role="tabpanel"
          aria-labelledby={`plan-tab-${p.id}`}
          className="plan"
          hidden={active !== i}
        >
          <div className="plan__main">
            <h3>{p.name}</h3>
            <p className="plan__text">{p.text}</p>
            <WhatsAppButton label={plans.cta} location={`plans-${p.id}`} message={planMessage(p.name)} variant="light" />
          </div>
          <div className="plan__side">
            <p className="plan__label">{plans.includesLabel}</p>
            <ul className="plan__includes">
              {p.includes.map((line) => (
                <li key={line}>
                  <svg viewBox="0 0 24 16" aria-hidden="true">
                    <path d="M2 9.5c2.2 1.4 4 3.2 5.6 5C11 9 15.6 4.4 22 1.6" />
                  </svg>
                  {line}
                </li>
              ))}
            </ul>
            <p className="plan__label">{plans.forLabel}</p>
            <p className="plan__for">{p.forWho}</p>
          </div>
        </div>
      ))}
      <div className="plans__cta">
        <p>{plans.closing}</p>
        <WhatsAppButton label={primaryAction} location="plans" />
      </div>
    </section>
  );
}
