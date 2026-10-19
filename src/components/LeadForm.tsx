"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/site";
import { leadSchema } from "@/lib/schema";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";

const f = contact.form;
type Field = "name" | "phone" | "businessType";

// הפרטים נבדקים (leadSchema) ואז נפתח וואטסאפ עם הודעה מוכנה.
// [למלא – לאן הלידים צריכים להגיע: מייל / Google Sheets / CRM]
// כדי לשלוח ל-endpoint במקום זאת, להחליף את window.open בקריאת fetch עם parsed.data.
export function LeadForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = leadSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setSent(false);
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    const { name, phone, businessType } = parsed.data;
    const text = [
      "היי זיו, השארתי פרטים באתר לשיחת ייעוץ חינם:",
      `${f.name}: ${name}`,
      `${f.phone}: ${phone}`,
      `${f.businessType}: ${businessType}`,
    ].join("\n");
    trackWhatsAppClick("form");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const field = (name: Field, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="field">
      <label htmlFor={`lead-${name}`} className="sr-only">
        {label}
      </label>
      <input
        id={`lead-${name}`}
        name={name}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `lead-${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`lead-${name}-error`} className="field__error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {field("name", f.name, { autoComplete: "name", placeholder: f.name })}
      {field("phone", f.phone, { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: f.phone })}
      {field("businessType", f.businessType, { placeholder: `${f.businessType} (${f.businessPlaceholder})` })}
      <button type="submit" className="btn btn--light coupon__submit">
        {f.submit}
      </button>
      <p className="coupon__note" role="status">
        {sent ? f.sent : f.note}
      </p>
    </form>
  );
}
