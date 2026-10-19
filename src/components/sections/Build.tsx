"use client";

import { useState } from "react";
import { build } from "@/content/site";
import { Chat } from "../Chat";

// הדבר החי בדף: בוחרים סוג עסק ורואים דוגמה לכלי שבונים בשיעור.
export function Build() {
  const [active, setActive] = useState(build.examples[0].id);
  const ex = build.examples.find((e) => e.id === active) ?? build.examples[0];

  return (
    <section id="build" className="build wrap" aria-labelledby="build-title">
      <div className="build__grid">
        <div className="build__stage" data-reveal>
          <div className="build__disc" data-field={ex.field} aria-hidden="true" />
          <div className="build__object swap" key={ex.id} aria-live="polite">
            <Chat title={ex.tool} sub={`דוגמה: ${ex.who}`} ask={ex.ask} answer={ex.answer} asList={ex.answer.length > 2} />
          </div>
        </div>
        <div className="build__list">
          <h2 id="build-title" data-reveal>
            {build.title}
          </h2>
          <p className="build__hint" data-reveal>
            {build.hint}
          </p>
          <div className="build__names" role="group" aria-label={build.hint}>
            {build.examples.map((e, i) => (
              <button
                key={e.id}
                type="button"
                className="build__name"
                aria-pressed={e.id === active}
                onClick={() => setActive(e.id)}
                onPointerEnter={(ev) => ev.pointerType === "mouse" && setActive(e.id)}
                data-reveal
                style={{ "--d": i } as React.CSSProperties}
              >
                <span className="dot" aria-hidden="true" />
                {e.who}
              </button>
            ))}
          </div>
          <p className="build__fact">
            <b>{ex.tool}</b>
            {ex.gives}
          </p>
        </div>
      </div>
    </section>
  );
}
