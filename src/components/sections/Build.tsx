"use client";

import { useState } from "react";
import { build } from "@/content/site";
import { IPhone, WhatsAppChat } from "../Chat";
import { WhatsAppButton } from "../WhatsAppButton";

// הדבר החי בדף: בוחרים סוג עסק ורואים מערכת שעובדת, כשיחת וואטסאפ בין לקוח למערכת של העסק.
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
                <WhatsAppChat name={ex.chatName} status="מענה אוטומטי" messages={ex.chat} bare />
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
            <b>{ex.system}</b>
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
