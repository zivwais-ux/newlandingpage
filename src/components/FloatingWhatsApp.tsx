"use client";

import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("floating")}
      aria-label="לשיחת ייעוץ חינם בוואטסאפ"
      data-floating-whatsapp
      className="fixed bottom-4 left-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl shadow-black/20 transition hover:bg-whatsapp-dark focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink md:hidden"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
