"use client";

import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  label: string;
  location: string;
  small?: boolean;
  className?: string;
};

export function WhatsAppButton({ label, location, small = false, className = "" }: Props) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(location)}
      className={`btn ${small ? "btn--small" : ""} ${className}`}
    >
      <WhatsAppIcon />
      <span>{label}</span>
    </a>
  );
}
