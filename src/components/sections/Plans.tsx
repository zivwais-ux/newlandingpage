"use client";

import { useEffect, useRef, useState } from "react";
import { plans, primaryAction } from "@/content/site";
import { WhatsAppButton } from "../WhatsAppButton";

// ארבעת המסלולים כתהליך אוטומציה (כמו n8n): צמתים קטנים שמחוברים בקו. בגלילה הקווים נמתחים
// מצומת לצומת והצמתים "נדלקים"; לחיצה על צומת פותחת את הפרטים שלו בחלון שמתחת, כמו בעורך.
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
  const [active, setActive] = useState(0);
  const flowRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // the data dot runs along the wires only while the flow is on screen
  useEffect(() => {
    const el = flowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.dataset.on = "";
      else delete el.dataset.on;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      <div ref={flowRef} className="flow">
        <ol className="flow__list" role="tablist" aria-label={plans.title}>
          {plans.items.map((p, i) => (
            <li key={p.id} className={`flow__node flow__node--${p.id}`} role="presentation">
              {i > 0 && (
                <span className="flow__wire" aria-hidden="true">
                  <i className="flow__pulse" />
                </span>
              )}
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
                className="flow__btn"
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="flow__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">{icons[p.id]}</svg>
                </span>
                <span className="flow__name">
                  <b>{p.name}</b>
                  <span className="flow__tag">{p.tag}</span>
                </span>
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
            className="flow__panel"
            hidden={active !== i}
          >
            <div className="flow__main">
              <h3>
                <span className="flow__mini" aria-hidden="true">
                  <svg viewBox="0 0 24 24">{icons[p.id]}</svg>
                </span>
                {p.name}
              </h3>
              <p className="flow__text">{p.text}</p>
              <WhatsAppButton label={plans.cta} location={`plans-${p.id}`} message={planMessage(p.name)} small />
            </div>
            <div className="flow__side">
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
          </div>
        ))}
      </div>
      <div className="plans__cta">
        <p>{plans.closing}</p>
        <WhatsAppButton label={primaryAction} location="plans" />
      </div>
    </section>
  );
}
