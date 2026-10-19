"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/site";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";

const f = contact.form;

// בשלב זה הטופס פותח וואטסאפ עם הפרטים.
// [למלא – לאן הלידים צריכים להגיע: מייל / Google Sheets / CRM]
// כדי לשלוח ל-endpoint במקום זאת, להחליף את גוף handleSubmit בקריאת fetch.
export function LeadForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = [
      "היי, השארתי פרטים באתר לשיחת ייעוץ חינם:",
      `${f.name}: ${data.get("name")}`,
      `${f.phone}: ${data.get("phone")}`,
      `${f.businessType}: ${data.get("businessType")}`,
    ].join("\n");
    trackWhatsAppClick("form");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="field">
        <span className="sr-only">{f.name}</span>
        <input name="name" required autoComplete="name" placeholder={f.name} />
      </label>
      <label className="field">
        <span className="sr-only">{f.phone}</span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          pattern="[0-9+\-\s]{9,15}"
          placeholder={f.phone}
        />
      </label>
      <label className="field">
        <span className="sr-only">{f.businessType}</span>
        <input name="businessType" required placeholder={`${f.businessType} (${f.businessPlaceholder})`} />
      </label>
      <button type="submit" className="btn coupon__submit">
        {f.submit}
      </button>
      <p className="coupon__note" role="status">
        {sent ? f.sent : f.note}
      </p>
    </form>
  );
}
