// בדיקת קצה-לקצה של האתר הבנוי (out/) בדפדפן אמיתי.
// הרצה: npm run build && npm run verify
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";
import { imageSnapshot } from "./image-snapshot.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "out");
const NUMBER = "972548044345";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".ico": "image/x-icon" };

if (!existsSync(join(OUT, "index.html"))) {
  console.error("אין build. הריצו קודם: npm run build");
  process.exit(1);
}

const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  let file = join(OUT, path);
  if (existsSync(file + ".html")) file += ".html";
  else if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(OUT) || !existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
try {
  // 1. התמונות: אותם קבצים בדיוק, ואותן תמונות באותם מקומות בדף
  const baseline = JSON.parse(readFileSync(join(ROOT, "tests/images-baseline.json"), "utf8"));
  const files = {};
  for (const f of readdirSync(join(ROOT, "public/img")).sort()) files[f] = createHash("sha256").update(readFileSync(join(ROOT, "public/img", f))).digest("hex");
  check("קבצי התמונות לא השתנו (תוכן, שמות, כמות)", JSON.stringify(files) === JSON.stringify(baseline.files), JSON.stringify(files));
  const onPage = await imageSnapshot(URL_, browser);
  check("התמונות בדף זהות לפני ואחרי (קובץ, alt, מיקום)", JSON.stringify(onPage) === JSON.stringify(baseline.onPage));

  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(URL_, { waitUntil: "networkidle" });

    const info = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const lines = [...h1.querySelectorAll("span")].map((s) => Math.round(s.getBoundingClientRect().height / parseFloat(getComputedStyle(s).lineHeight)));
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        h1: h1.innerText.replace(/\s+/g, " "),
        h1Lines: lines.reduce((a, b) => a + b, 0),
        heroText: document.querySelector(".hero").innerText,
        wa: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href),
        floating: getComputedStyle(document.querySelector("[data-floating-whatsapp]")).display !== "none",
        pink: [...document.querySelectorAll("*")].some((el) => /248, 199, 201/.test(getComputedStyle(el).backgroundColor)),
        prices: /₪|ש״ח|שקלים/.test(document.body.innerText),
      };
    });
    check(`${width}px: אין גלילה הצידה`, info.overflow <= 0, `${info.overflow}px`);
    check(`${width}px: הכותרת הראשית בשתי שורות לכל היותר`, info.h1Lines <= 2, `${info.h1Lines} שורות`);
    check(`${width}px: "בלי להיות טכנולוגי" בכותרת`, info.h1.includes("בלי להיות טכנולוגי"), info.h1);
    check(`${width}px: "שיעורים פרטיים וייעוץ AI" בהירו`, info.heroText.includes("שיעורים פרטיים וייעוץ AI"));
    check(
      `${width}px: כל ${info.wa.length} קישורי הוואטסאפ פותחים את 054-804-4345 עם הודעה מוכנה`,
      info.wa.length >= 6 && info.wa.every((h) => { const u = new URL(h); return u.pathname === `/${NUMBER}` && (u.searchParams.get("text") ?? "").startsWith("היי זיו"); }),
    );
    check(`${width}px: כפתור וואטסאפ צף רק בטלפון ובטאבלט`, info.floating === width < 900);
    check(`${width}px: אין יותר ורוד באתר`, !info.pink);
    check(`${width}px: אין מחירים`, !info.prices);
    check(`${width}px: אין שגיאות בקונסול`, errors.length === 0, errors.join(" | "));
    await page.close();
  }

  // 2. הבורר "מה בונים" מחליף דוגמה ואת ההודעה המוכנה
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.goto(URL_, { waitUntil: "networkidle" });
  const ctaHref = () => page.getAttribute(".build__cta a", "href");
  const before = new URL(await ctaHref()).searchParams.get("text");
  await page.getByRole("button", { name: "חנות קטנה" }).tap();
  await page.waitForTimeout(350);
  const after = new URL(await ctaHref()).searchParams.get("text");
  const title = await page.textContent(".build__object .chat__title");
  const field = await page.getAttribute(".build__disc", "data-field");
  check("בורר העסקים: הדוגמה מתחלפת", title === "תיאורי מוצרים", title);
  check("בורר העסקים: ההודעה המוכנה מותאמת לסוג העסק", before.includes("מורה פרטי") && after.includes("חנות קטנה"), after);
  check("בורר העסקים: הדיסק מחליף צבע לירוק כהה", field === "forest", field);
  check("בורר העסקים: הכפתור הנבחר מסומן ל-aria", (await page.getAttribute('button.build__name[aria-pressed="true"]', "id")) === null && (await page.locator('button.build__name[aria-pressed="true"]').innerText()).includes("חנות קטנה"));

  // 3. הטופס: שגיאות על קלט ריק/שגוי, ופתיחת וואטסאפ עם פרטים מנורמלים על קלט תקין
  await page.evaluate(() => {
    window.__opened = [];
    window.open = (u) => (window.__opened.push(String(u)), null);
  });
  await page.click(".coupon__submit");
  const errs = await page.locator(".field__error").allInnerTexts();
  check("טופס ריק: שגיאה לכל אחד משלושת השדות, בעברית", errs.length === 3 && errs.every((e) => /[א-ת]/.test(e)), errs.join(" | "));
  check("טופס ריק: הפוקוס עובר לשדה הראשון עם שגיאה", (await page.evaluate(() => document.activeElement?.name)) === "name");
  check("טופס ריק: וואטסאפ לא נפתח", (await page.evaluate(() => window.__opened.length)) === 0);
  await page.fill("#lead-name", "דנה");
  await page.fill("#lead-phone", "12345");
  await page.fill("#lead-businessType", "מספרה");
  await page.click(".coupon__submit");
  check("טלפון שגוי: שגיאה רק בשדה הטלפון", (await page.locator(".field__error").count()) === 1 && (await page.getAttribute("#lead-phone", "aria-invalid")) === "true");
  await page.fill("#lead-phone", "+972 50-123-4567");
  await page.click(".coupon__submit");
  const opened = await page.evaluate(() => window.__opened);
  const text = opened[0] ? new URL(opened[0]).searchParams.get("text") : "";
  check("טופס תקין: נפתח וואטסאפ ל-054-804-4345", opened.length === 1 && new URL(opened[0]).pathname === `/${NUMBER}`, opened[0]);
  check("טופס תקין: ההודעה כוללת שם, טלפון מנורמל וסוג עסק", text.includes("דנה") && text.includes("0501234567") && text.includes("מספרה"), text);
  check("טופס תקין: מוצגת הודעת תודה", (await page.textContent(".coupon__note")).includes("נפתחה שיחת וואטסאפ"));

  // 4. שאלות נפוצות: אחת פתוחה בכל פעם
  await page.click("#faq details:nth-of-type(3) summary");
  check("שאלות נפוצות: רק כרטיס אחד פתוח", (await page.locator("#faq details[open]").count()) === 1);

  // 5. עמודי משנה וקישורים פנימיים
  for (const path of ["accessibility", "privacy"]) {
    const res = await page.goto(URL_ + path);
    check(`/${path} נטען`, res.status() === 200);
  }
  await page.goto(URL_);
  const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")).filter((h) => h.length > 1 && !document.querySelector(h)));
  check("כל קישור פנימי (#) מוביל לחלק קיים", anchors.length === 0, anchors.join(", "));
  const tel = await page.getAttribute('a[href^="tel:"]', "href");
  check("קישור טלפון בפוטר תקין", tel === `tel:+${NUMBER}`, tel);
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.name}${!r.ok && r.detail ? `\n    ${r.detail}` : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} בדיקות עברו`);
process.exit(failed.length ? 1 : 0);
