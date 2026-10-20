"use client";

import { useEffect, useState } from "react";
import { primaryAction } from "@/content/site";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

// הכפתור הצף מתחבא כשכפתור וואטסאפ אחר כבר על המסך (בהירו, בטופס ובפוטר), כדי לא לכסות אותו.
export function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = [document.querySelector(".hero__actions"), document.querySelector(".coupon__b"), document.querySelector(".footer__cta")].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
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
