import { z } from "zod";

// אימות התוכן והטופס (המקבילה של pydantic ב-TypeScript).
// התוכן נבדק בזמן הבנייה (src/app/page.tsx): תוכן שבור מכשיל את ה-build.

/** מנרמל מספר טלפון ישראלי לפורמט מקומי (0548044345). מחזיר null אם המספר לא תקין. */
export function normalizeIsraeliPhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("972")) digits = "0" + digits.slice(3);
  if (!/^\d+$/.test(digits)) return null;
  // נייד: 05X + 7 ספרות. נייח: 0[2-4,8-9] + 7 ספרות, או 07X + 7 ספרות.
  if (/^05\d{8}$/.test(digits) || /^07\d{8}$/.test(digits) || /^0[2-489]\d{7}$/.test(digits)) return digits;
  return null;
}

/** ממיר מספר מקומי (0548044345) לפורמט של wa.me (972548044345). */
export function toWhatsAppNumber(local: string): string {
  return "972" + local.slice(1);
}

const text = z.string().trim().min(1, "טקסט ריק");
const todoOr = (schema: z.ZodString) => z.union([schema, z.string().startsWith("[למלא")]);

export const whatsappNumberSchema = z.string().regex(/^9725\d{8}$/, "מספר וואטסאפ צריך להיות נייד ישראלי בפורמט 9725XXXXXXXX");

export const whatsappMessageSchema = text.max(300, "הודעה מוכנה ארוכה מדי לוואטסאפ").startsWith("היי זיו", "הודעה מוכנה צריכה להתחיל ב'היי זיו'");

const imagePath = z.string().regex(/^\/img\/[a-z0-9-]+\.webp$/, "נתיב תמונה צריך להיות /img/<name>.webp");

const buildExampleSchema = z.object({
  id: z.string().regex(/^[a-z]+$/),
  who: text,
  tool: text,
  ask: text,
  intro: text.max(60),
  answer: z.array(text).min(1).max(4),
  gives: text,
  message: whatsappMessageSchema,
  field: z.enum(["mint", "forest"]),
});

export const contentSchema = z.object({
  business: z.object({
    name: todoOr(text),
    teacher: text,
    whatsappNumber: whatsappNumberSchema,
    phoneDisplay: text.refine((v) => normalizeIsraeliPhone(v) !== null, "מספר הטלפון לתצוגה לא תקין"),
    email: todoOr(z.string().email()),
    area: todoOr(text),
    siteUrl: z.string().url(),
  }),
  analytics: z.object({
    gaId: z.union([z.literal(""), z.string().regex(/^G-[A-Z0-9]+$/)]),
    metaPixelId: z.union([z.literal(""), z.string().regex(/^\d+$/)]),
  }),
  whatsappMessage: whatsappMessageSchema,
  primaryAction: text.max(32),
  navAction: text.max(20),
  seo: z.object({ title: text.max(70), description: text.max(170) }),
  nav: z.object({
    wordmark: text,
    tagline: text,
    links: z.array(z.object({ href: z.string().regex(/^#[a-z]+$/), label: text })).min(1).max(5),
  }),
  hero: z.object({
    titleLines: z.tuple([text.max(18), text.max(20)]),
    subtitle: text.includes("שיעורים פרטיים וייעוץ AI", { message: "תת-הכותרת בהירו חייבת לכלול 'שיעורים פרטיים וייעוץ AI'" }),
    note: text,
    photoAlt: text,
  }),
  intro: z.array(z.object({ text: text, icon: z.enum(["laptop", "notebook", "coffee"]).optional() })).min(1),
  pain: z.object({ title: text, items: z.array(text).min(2).max(5), answer: text, cta: text }),
  build: z
    .object({ title: text, hint: text, ctaLead: text, ctaLabel: text.max(32), examples: z.array(buildExampleSchema).min(2) })
    .superRefine((b, ctx) => {
      const ids = b.examples.map((e) => e.id);
      if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "מזהי הדוגמאות ב'מה בונים' חייבים להיות ייחודיים" });
    }),
  how: z.object({
    title: text,
    steps: z.array(z.object({ name: text, text: text, img: imagePath.optional(), alt: text.optional() })).length(3),
  }),
  about: z.object({
    title: text,
    photoSrc: z.union([z.literal(""), imagePath]),
    photoAlt: text,
    blocks: z.array(z.object({ title: text, text: text })).min(1),
    credentials: z.array(text).min(1).max(5),
  }),
  faq: z.object({ title: text, items: z.array(z.object({ tab: text.max(12), q: text, a: text })).min(1) }),
  contact: z.object({
    title: text,
    text: text,
    whatsappLink: text,
    form: z.object({
      name: text,
      phone: text,
      businessType: text,
      businessPlaceholder: text,
      submit: text,
      note: text,
      sent: text,
    }),
  }),
  testimonials: z.object({
    show: z.boolean(),
    title: text,
    items: z.array(z.object({ quote: text, name: text, business: text })),
  }),
  footer: z.object({
    ctaTitle: text,
    ctaText: text,
    composerLabel: text,
    composerSend: text.max(24),
    accessibility: text,
    privacy: text,
  }),
});

export type Content = z.infer<typeof contentSchema>;

/** ההודעה שהגולש כותב בתיבה שבפוטר לפני שליחה לוואטסאפ. */
export const footerMessageSchema = z
  .string()
  .trim()
  .min(2, "כתבו כמה מילים לפני השליחה")
  .max(500, "ההודעה ארוכה מדי, נסו לקצר אותה");

/** פרטי ליד מהטופס. */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "כתבו שם, לפחות שתי אותיות").max(60, "השם ארוך מדי"),
  phone: z
    .string()
    .trim()
    .min(1, "כתבו מספר טלפון")
    .transform((v, ctx) => {
      const local = normalizeIsraeliPhone(v);
      if (!local) {
        ctx.addIssue({ code: "custom", message: "מספר הטלפון לא נראה תקין, למשל 050-1234567" });
        return z.NEVER;
      }
      return local;
    }),
  businessType: z.string().trim().min(2, "ספרו במילה או שתיים מה העסק").max(80, "קצר יותר, בבקשה"),
});

export type Lead = z.infer<typeof leadSchema>;
