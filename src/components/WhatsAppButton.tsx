"use client";

import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  label: string;
  location: string;
  className?: string;
};

export function WhatsAppButton({ label, location, className = "" }: Props) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(location)}
      className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-whatsapp px-7 py-3 text-lg font-bold text-white shadow-lg shadow-whatsapp/25 transition hover:bg-whatsapp-dark focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink ${className}`}
    >
      <WhatsAppIcon />
      <span>{label}</span>
    </a>
  );
}
