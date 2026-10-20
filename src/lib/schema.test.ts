import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as content from "@/content/site";
import { validateContent } from "./content";
import { contentSchema, footerMessageSchema, leadSchema, normalizeIsraeliPhone, toWhatsAppNumber } from "./schema";

describe("התוכן של הדף (site.ts)", () => {
  it("עובר את הסכמה", () => {
    expect(() => validateContent()).not.toThrow();
  });

  it("מספר הוואטסאפ הוא 054-804-4345", () => {
    expect(content.business.whatsappNumber).toBe("972548044345");
    expect(toWhatsAppNumber(normalizeIsraeliPhone(content.business.phoneDisplay)!)).toBe(content.business.whatsappNumber);
  });

  it("ההירו אומר 'בלי להיות טכנולוגי' ו'שיעורים פרטיים וייעוץ AI'", () => {
    expect(content.hero.titleLines.join(" ")).toContain("בלי להיות טכנולוגי");
    expect(content.hero.titleLines.join(" ")).not.toMatch(/טכנולוג(?!י)/);
    expect(content.hero.subtitle).toContain("שיעורים פרטיים וייעוץ AI");
  });

  it("אין טענות על לקוחות או על עסקים שזיו בנה עבורם", () => {
    const all = JSON.stringify(content);
    for (const claim of ["הלקוחות שלי", "ללקוחות שלי", "בעסקים אמיתיים", "בניתי את זה", "מותגים שמוכרים"]) expect(all).not.toContain(claim);
    expect(content.about.credentials.join(" ")).toContain("בעל דיפלומת מפתח AI מהאוניברסיטה העברית");
    expect(JSON.stringify(content)).not.toMatch(/בחברה גדולה|ז׳רגון|ז'רגון/);
  });

  it("משפט הפתיחה משתמש באייקונים ולא בתמונות, ובלי ניסוח 'לא X ולא Y'", () => {
    expect(content.intro.map((p) => p.icon).filter(Boolean)).toEqual(["laptop", "notebook", "coffee"]);
    expect(content.intro.some((p) => "img" in p)).toBe(false);
    expect(content.intro.map((p) => p.text).join("")).not.toMatch(/^לא /);
  });

  it("לכל דוגמה ב'מה בונים' יש שורת פתיחה לתשובה", () => {
    for (const ex of content.build.examples) expect(ex.intro.length).toBeGreaterThan(5);
  });

  it("אין מחירים בדף", () => {
    expect(JSON.stringify(content)).not.toMatch(/₪|\bש״ח\b|\bשקל/);
  });

  it("כל תמונה שהתוכן מפנה אליה קיימת ב-public", () => {
    const paths = [
      ...content.how.steps.map((s) => ("img" in s ? s.img : undefined)),
      content.about.photoSrc || undefined,
    ].filter(Boolean) as string[];
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) expect(existsSync(join(process.cwd(), "public", p)), p).toBe(true);
  });

  it("נכשל על תוכן פגום", () => {
    const broken = (patch: (c: Record<string, unknown>) => void) => {
      const c = structuredClone({ ...content }) as Record<string, unknown>;
      patch(c);
      return contentSchema.safeParse(c).success;
    };
    expect(broken(() => {})).toBe(true);
    expect(broken((c) => ((c.business as { whatsappNumber: string }).whatsappNumber = "0548044345"))).toBe(false);
    expect(broken((c) => (((c.how as { steps: { img?: string }[] }).steps[1].img = "/images/x.jpg")))).toBe(false);
    expect(broken((c) => ((c.intro as { icon?: string }[])[0].icon = "rocket"))).toBe(false);
    expect(broken((c) => ((c.hero as { subtitle: string }).subtitle = "שיעורים פרטיים בלבד"))).toBe(false);
    expect(broken((c) => ((c.whatsappMessage as unknown) = "שלום"))).toBe(false);
    expect(
      broken((c) => {
        const ex = (c.build as { examples: { id: string }[] }).examples;
        ex[1].id = ex[0].id;
      }),
    ).toBe(false);
  });
});

describe("normalizeIsraeliPhone", () => {
  it.each([
    ["0548044345", "0548044345"],
    ["054-804-4345", "0548044345"],
    ["054 804 4345", "0548044345"],
    ["+972 54-804-4345", "0548044345"],
    ["972548044345", "0548044345"],
    ["03-1234567", "031234567"],
    ["077-1234567", "0771234567"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeIsraeliPhone(input)).toBe(expected);
  });

  it.each(["", "12345", "054804434", "05480443451", "abc0548044345", "+1 202 555 0100"])("דוחה %j", (input) => {
    expect(normalizeIsraeliPhone(input)).toBeNull();
  });
});

describe("leadSchema (הטופס)", () => {
  it("מקבל פרטים תקינים ומנרמל את הטלפון", () => {
    const r = leadSchema.parse({ name: " דנה ", phone: "+972-50-123-4567", businessType: "מספרה" });
    expect(r).toEqual({ name: "דנה", phone: "0501234567", businessType: "מספרה" });
  });

  it("מחזיר שגיאה בעברית לכל שדה חסר", () => {
    const r = leadSchema.safeParse({ name: "", phone: "", businessType: "" });
    expect(r.success).toBe(false);
    const fields = new Set(r.error!.issues.map((i) => i.path[0]));
    expect(fields).toEqual(new Set(["name", "phone", "businessType"]));
    for (const i of r.error!.issues) expect(i.message).toMatch(/[א-ת]/);
  });

  it("דוחה טלפון לא תקין", () => {
    const r = leadSchema.safeParse({ name: "דנה", phone: "12345", businessType: "מספרה" });
    expect(r.success).toBe(false);
    expect(r.error!.issues[0].path).toEqual(["phone"]);
  });
});

describe("footerMessageSchema (תיבת ההודעה בפוטר)", () => {
  it("מקבל הודעה רגילה ומסיר רווחים מיותרים", () => {
    expect(footerMessageSchema.parse("  היי זיו, יש לי מספרה  ")).toBe("היי זיו, יש לי מספרה");
  });
  it("דוחה הודעה ריקה או ארוכה מדי, עם שגיאה בעברית", () => {
    for (const bad of ["", "   ", "א".repeat(501)]) {
      const r = footerMessageSchema.safeParse(bad);
      expect(r.success).toBe(false);
      expect(r.error!.issues[0].message).toMatch(/[א-ת]/);
    }
  });
});
