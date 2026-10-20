"use client";

import { useEffect, useState } from "react";
import { primaryAction } from "@/content/site";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

// הכפתור הצף: מופיע באמצע הדף, ומתחבא כשכפתור וואטסאפ אחר כבר על המסך (בהירו, ב"ספרו לי…", בטופס ובפוטר).
export function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // מוצג רק באמצע הדף, ורק כשאין כפתור וואטסאפ אחר על המסך. ברירת המחדל: מוסתר,
    // כך שאם המדידה מתעכבת לרגע הכפתור לא מכסה טקסט.
    const zones = ["#build", "#how", "#about", "#faq"].map((s) => document.querySelector(s)).filter(Boolean) as Element[];
    const others = [".hero__actions", ".intro", ".pain__mark", ".coupon__b", ".footer__cta"].map((s) => document.querySelector(s)).filter(Boolean) as Element[];
    const inZone = new Set<Element>();
    const otherVisible = new Set<Element>();
    const update = () => setHidden(inZone.size === 0 || otherVisible.size > 0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const set = zones.includes(e.target) ? inZone : otherVisible;
        if (e.isIntersecting) set.add(e.target);
        else set.delete(e.target);
      }
      update();
    });
    [...zones, ...others].forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("floating")}
      aria-label={`${primaryAction} בוואטסאפ`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      data-floating-whatsapp
      className={`float-wa${hidden ? " is-hidden" : ""}`}
    >
      <WhatsAppIcon />
    </a>
  );
}
