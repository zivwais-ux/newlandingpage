"use client";

import { useState, type FormEvent } from "react";
import { finalCta } from "@/content/site";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";

const f = finalCta.form;

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

  const input =
    "mt-2 block w-full min-h-13 rounded-xl border-2 border-line bg-white px-4 py-3 text-lg text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20";

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-line sm:p-8">
      <h3 className="text-2xl font-bold text-ink">{f.title}</h3>
      <div className="mt-6 space-y-5">
        <label className="block text-lg font-medium text-ink">
          {f.name}
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className="block text-lg font-medium text-ink">
          {f.phone}
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+\-\s]{9,15}"
            dir="ltr"
            className={`${input} text-right`}
          />
        </label>
        <label className="block text-lg font-medium text-ink">
          {f.businessType}
          <input name="businessType" required placeholder={f.businessPlaceholder} className={input} />
        </label>
      </div>
      <button
        type="submit"
        className="mt-7 min-h-14 w-full rounded-full bg-accent px-6 py-3 text-lg font-bold text-white transition hover:bg-accent-dark focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {f.submit}
      </button>
      <p className="mt-4 text-base text-muted" role="status">
        {sent ? "תודה! נפתחה שיחת וואטסאפ עם הפרטים – רק ללחוץ שליחה." : f.note}
      </p>
    </form>
  );
}
