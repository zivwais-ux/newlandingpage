"use client";

import { useEffect, useRef } from "react";

// עוטף את תהליך המסלולים: נקודות המידע זורמות בקווים רק כשהחלק על המסך,
// כדי שלא יעלו כלום בשאר הגלילה בדף (כמו SkyWatch).
export function FlowWatch({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.dataset.on = "";
      else delete el.dataset.on;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="flow">
      {children}
    </div>
  );
}
