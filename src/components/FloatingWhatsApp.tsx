"use client";

import { primaryAction } from "@/content/site";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("floating")}
      aria-label={`${primaryAction} בוואטסאפ`}
      data-floating-whatsapp
      className="float-wa"
    >
      <WhatsAppIcon />
    </a>
  );
}
