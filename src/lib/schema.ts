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

// each example shows a different system on the iPhone screen: three to five items, short enough to fit
const items = <T extends z.ZodTypeAny>(item: T) => z.array(item).min(3).max(5);
const screenSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("whatsapp"), chatName: text.max(20), chat: items(z.object({ from: z.enum(["client", "bot"]), text: text.max(90) })) }),
  z.object({
    kind: z.literal("crm"),
    title: text.max(28),
    leads: items(z.object({ name: text.max(16), need: text.max(28), source: text.max(10), status: text.max(14), next: text.max(14).optional() })),
    task: text.max(40),
  }),
  z.object({
    kind: z.literal("payroll"),
    title: text.max(20),
    rows: items(z.object({ name: text.max(12), hours: text.max(12), pay: text.max(10) })),
    total: text.max(12),
    done: text.max(24),
  }),
  z.object({
    kind: z.literal("inbox"),
    title: text.max(16),
    mails: items(z.object({ from: text.max(16), subject: text.max(24), amount: text.max(10) })),
    alert: z.object({ app: text.max(20), text: text.max(90) }),
  }),
  z.object({
    kind: z.literal("calendar"),
    day: text.max(26),
    appts: items(z.object({ time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), name: text.max(20), status: z.enum(["confirmed", "waitlist"]) })),
    note: text.max(70),
  }),
]);

const buildExampleSchema = z.object({
  id: z.string().regex(/^[a-z]+$/),
  who: text,
  system: text.max(24),
  screen: screenSchema,
  gives: text,
  message: whatsappMessageSchema,
  field: z.enum(["sage", "forest"]),
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
    wordmark: z.literal("ZIV solutions"),
    tagline: text,
    links: z.array(z.object({ href: z.string().regex(/^#[a-z]+$/), label: text })).min(1).max(5),
  }),
  hero: z.object({
    titleLines: z.tuple([text.max(18), text.max(20)]),
    subtitle: text.includes("מערכות AI", { message: "תת-הכותרת בהירו חייבת לומר שזיו בונה מערכות AI" }),
    trust: z.array(text.max(36)).length(3, "שורת האמון בהירו כוללת שלושה פריטים"),
    photoAlt: text,
  }),
  intro: z.object({ before: text, mark: text.max(20), after: z.string() }),
  pain: z.object({
    title: text,
    items: z
      .array(
        z.object({
          app: text.max(24),
          icon: z.enum(["bell", "spark", "people", "note"]),
          time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "שעה בפורמט HH:MM"),
          text: text,
        }),
      )
      .min(2)
      .max(5),
    answer: text,
    cta: text,
  }),
  build: z
    .object({ title: text, hint: text, ctaLead: text, ctaLabel: text.max(32), examples: z.array(buildExampleSchema).min(2) })
    .superRefine((b, ctx) => {
      const ids = b.examples.map((e) => e.id);
      if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "מזהי הדוגמאות ב'מה בונים' חייבים להיות ייחודיים" });
      const kinds = b.examples.map((e) => e.screen.kind);
      if (new Set(kinds).size !== kinds.length) ctx.addIssue({ code: "custom", message: "כל דוגמה ב'מה בונים' מציגה מערכת מסוג אחר" });
    }),
  how: z.object({
    title: text,
    steps: z.array(z.object({ name: text, text: text, img: imagePath.optional(), alt: text.optional() })).length(3),
  }),
  about: z.object({
    title: text,
    photoSrc: z.union([z.literal(""), imagePath]),
    photoAlt: text,
    lead: text.max(280, "הפסקה ב'עליי' צריכה להישאר קצרה"),
    credentials: z
      .array(z.object({ title: text.max(60), text: text.max(60) }))
      .length(3, "ב'עליי' יש בדיוק שלושה כרטיסי הכשרה")
      .refine((c) => c[0].title.startsWith("בעל דיפלומת מפתח AI"), "הכרטיס הראשון הוא הדיפלומה"),
  }),
  plans: z.object({
    title: text.max(48),
    subtitle: text.max(80),
    cta: text.max(24),
    includesLabel: text.max(16),
    forLabel: text.max(20),
    closing: text.max(80),
    items: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z]+$/),
          name: text.max(24),
          tag: text.max(24),
          text: text.max(110),
          includes: z.array(text.max(40)).length(3, "בכל מסלול שלוש שורות 'מה כלול'"),
          forWho: text.max(60),
        }),
      )
      .length(4, "יש ארבעה מסלולים")
      .refine((items) => new Set(items.map((i) => i.id)).size === items.length, "מזהי המסלולים חייבים להיות ייחודיים"),
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
    ctaText: text.max(80, "המשפט בפוטר צריך להישאר קצר"),
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
