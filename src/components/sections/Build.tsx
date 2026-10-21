"use client";

import { useState } from "react";
import { build } from "@/content/site";
import { AssistantChat, IPhone } from "../Chat";
import { WhatsAppButton } from "../WhatsAppButton";

// הדבר החי בדף: בוחרים סוג עסק ורואים דוגמה לכלי שבונים בשיעור.
export function Build() {
  const [active, setActive] = useState(build.examples[0].id);
  const ex = build.examples.find((e) => e.id === active) ?? build.examples[0];

  return (
    <section id="build" className="build wrap" aria-labelledby="build-title">
      <div className="build__grid">
        <div className="build__stage" data-reveal>
          <div className="build__disc" data-field={ex.field} aria-hidden="true" />
          <div className="build__object">
            {/* המכשיר נשאר במקומו; בבחירת עסק מתחלף רק המסך */}
            <IPhone>
              <div className="build__screen swap" key={ex.id} aria-live="polite">
                <AssistantChat ask={ex.ask} intro={ex.intro} tool={ex.tool} answer={ex.answer} asList={ex.answer.length > 2} bare />
              </div>
            </IPhone>
          </div>
        </div>
        <div className="build__list">
          <h2 id="build-title" data-reveal>
            {build.title}
          </h2>
          <p className="build__hint">
            {build.hint}
          </p>
          <div className="build__names" role="group" aria-label={build.hint}>
            {build.examples.map((e) => (
              <button
                key={e.id}
                type="button"
                className="build__name"
                aria-pressed={e.id === active}
                onClick={() => setActive(e.id)}
                onPointerEnter={(ev) => ev.pointerType === "mouse" && setActive(e.id)}
              >
                {e.who}
              </button>
            ))}
          </div>
          <p className="build__fact">
            <b>{ex.tool}</b>
            {ex.gives}
          </p>
          <div className="build__cta">
            <p>{build.ctaLead}</p>
            <WhatsAppButton label={build.ctaLabel} location={`build-${ex.id}`} message={ex.message} />
          </div>
        </div>
      </div>
    </section>
  );
}
