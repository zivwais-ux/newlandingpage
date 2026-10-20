"use client";

import { useEffect } from "react";

// מפעיל את כניסת האלמנטים המסומנים ב-data-reveal פעם אחת, כשהם נכנסים למסך.
export function Reveal() {
  useEffect(() => {
    // דפדפן שתומך באנימציות גלילה מקבל את התנועה מה-CSS; זה רק גיבוי לשאר.
    if (CSS.supports("animation-timeline: view()")) return;
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
