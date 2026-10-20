"use client";

import { useState, type FormEvent } from "react";
import { business, footer, whatsappMessage } from "@/content/site";
import { footerMessageSchema } from "@/lib/schema";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

// תיבת הודעה אמיתית: הגולש עורך את ההודעה המוכנה ושולח אותה ישר לוואטסאפ.
// בלי JavaScript הטופס עדיין עובד: הוא נשלח ישירות ל-wa.me עם הטקסט שבתיבה.
export function FooterComposer() {
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = footerMessageSchema.safeParse(new FormData(e.currentTarget).get("text"));
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      e.currentTarget.querySelector("textarea")?.focus();
      return;
    }
    setError("");
    trackWhatsAppClick("footer-composer");
    window.open(whatsappLink(parsed.data), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      className="composer"
      action={`https://wa.me/${business.whatsappNumber}`}
      method="get"
      target="_blank"
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor="composer-text" className="sr-only">
        {footer.composerLabel}
      </label>
      <textarea
        id="composer-text"
        name="text"
        rows={3}
        defaultValue={whatsappMessage}
        maxLength={500}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "composer-error" : undefined}
        onInput={() => error && setError("")}
      />
      <button type="submit" className="btn btn--light composer__send">
        <WhatsAppIcon />
        <span>{footer.composerSend}</span>
      </button>
      {error && (
        <p id="composer-error" className="field__error composer__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
