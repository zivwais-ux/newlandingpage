"use client";

import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  label: string;
  location: string;
  /** הודעה מוכנה אחרת מברירת המחדל */
  message?: string;
  /** solid: ירוק על רקע בהיר · light: מנטה על רקע כהה · text: קישור בתוך טקסט */
  variant?: "solid" | "light" | "text";
  small?: boolean;
  className?: string;
};

export function WhatsAppButton({ label, location, message, variant = "solid", small = false, className = "" }: Props) {
  const classes =
    variant === "text" ? `link ${className}` : `btn ${variant === "light" ? "btn--light" : ""} ${small ? "btn--small" : ""} ${className}`;
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(location)}
      className={classes}
    >
      {variant !== "text" && <WhatsAppIcon />}
      <span>{label}</span>
    </a>
  );
}
