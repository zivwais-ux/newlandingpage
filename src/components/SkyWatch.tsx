"use client";

import { useEffect, useRef } from "react";

// עוטף את שמי הערב של "עוד ערב של עבודה?": נקודות האור זזות רק כשהחלק על המסך,
// כדי שלא יעלו כלום בשאר הגלילה בדף.
export function SkyWatch({ children }: { children: React.ReactNode }) {
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
    <div ref={ref} className="pain__sky" aria-hidden="true">
      {children}
    </div>
  );
}
