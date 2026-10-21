"use client";

import { useEffect, useRef } from "react";

// אור מרווה רך על הרקע הירוק של ההירו. במחשב הוא עוקב אחרי העכבר בעדינות (transform בלבד, פעם בפריים);
// בטלפון הוא נודד לאט ב-CSS, ועם הפחתת תנועה הוא נשאר במקום.
export function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.parentElement;
    if (!el || !hero) return;
    // the slow drift (phones) stops while the hero is off screen, so it costs nothing further down the page
    const io = new IntersectionObserver(([entry]) => {
      el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    });
    io.observe(hero);
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
      return () => io.disconnect();
    }

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(3)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      // מרכז האור הולך אחרי העכבר, אבל רק בחלק מהדרך: תנועה רכה ולא "פנס"
      tx = (e.clientX - r.left - r.width / 2) * 0.45;
      ty = (e.clientY - r.top - r.height / 2) * 0.45;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    hero.addEventListener("pointermove", onMove);
    return () => {
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="hero__glow" aria-hidden="true" />;
}
