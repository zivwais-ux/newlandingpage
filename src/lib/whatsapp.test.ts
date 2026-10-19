import { describe, expect, it } from "vitest";
import { build, whatsappMessage } from "@/content/site";
import { presetWhatsappLink, whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("פותח שיחה עם 054-804-4345 וההודעה המוכנה", () => {
    const url = new URL(whatsappLink());
    expect(url.origin + url.pathname).toBe("https://wa.me/972548044345");
    expect(url.searchParams.get("text")).toBe(whatsappMessage);
  });

  it("מקודד עברית, שורות חדשות ותווים מיוחדים נכון", () => {
    const text = "היי זיו,\nשם: דנה & בנות\nטלפון: 050-1234567?";
    const url = new URL(whatsappLink(text));
    expect(url.searchParams.get("text")).toBe(text);
    expect(url.search).not.toContain("\n");
  });

  it("זורק שגיאה על מספר לא תקין", () => {
    expect(() => whatsappLink("היי", "0548044345")).toThrow();
    expect(() => whatsappLink("היי", "")).toThrow();
  });

  it("כל הודעה מוכנה ב'מה בונים' תקינה", () => {
    for (const ex of build.examples) {
      const url = new URL(presetWhatsappLink(ex.message));
      expect(url.searchParams.get("text")).toBe(ex.message);
    }
  });

  it("presetWhatsappLink דוחה הודעה שלא מתחילה ב'היי זיו'", () => {
    expect(() => presetWhatsappLink("שלום")).toThrow();
  });
});
