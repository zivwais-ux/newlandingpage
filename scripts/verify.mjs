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
  const title = await page.textContent(".build__object .ai__tool");
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

  // 4. שיחות שנראות אמיתיות, אייקונים בפתיחה, ופוטר בלי בלוקים של אותיות
  check("שיחת הוואטסאפ: שעה ווי כפול כחול", (await page.locator(".phone--wa .wa__meta").first().innerText()).includes("10:42") && (await page.locator(".phone--wa .wa__ticks").count()) === 1);
  check("שיחת העוזר: שורת סטטוס, שורת פתיחה ותיבת 'שאלו כל דבר'", (await page.locator(".phone--ai .phone__status").count()) === 1 && (await page.locator(".phone--ai .ai__answer p").first().innerText()).length > 5 && (await page.locator(".phone--ai .ai__placeholder").innerText()) === "שאלו כל דבר");
  check(
    "משפט הפתיחה: קו כתב-יד מתחת ל'כלי שעובד', בלי אייקונים ובלי תמונות",
    (await page.locator(".intro .intro__mark .intro__line").count()) === 1 &&
      (await page.locator(".intro__mark").innerText()).trim() === "כלי שעובד" &&
      (await page.locator(".intro svg:not(.intro__line), .intro img").count()) === 0,
  );
  check("הפוטר: אין יותר בלוקים של אותיות", (await page.locator("footer svg.mark, footer .mark").count()) === 0);
  const cards = await page.locator(".about__card h3").allInnerTexts();
  check("עליי: שלושה כרטיסי הכשרה, הראשון הוא הדיפלומה", cards.length === 3 && cards[0].startsWith("בעל דיפלומת מפתח AI מהאוניברסיטה העברית"), cards.join(" | "));
  check("עליי: פסקה אחת קצרה", (await page.locator(".about__lead").count()) === 1 && (await page.locator(".about__lead").innerText()).length <= 220);
  check(
    "הירו: הודעת הוואטסאפ הצפה היא ההודעה המוכנה, ושורת אמון של שלושה פריטים",
    (await page.locator(".hero__bubble .wa__msg").innerText()).startsWith("היי זיו") && (await page.locator(".hero__trust li").count()) === 3,
  );
  check(
    "המילים המסומנות בעט מודגשות (600)",
    (await page.evaluate(() => [".intro__mark", ".pain__mark .link"].every((q) => getComputedStyle(document.querySelector(q)).fontWeight === "600"))),
  );

  // 5. תיבת ההודעה בפוטר
  await page.evaluate(() => (window.__opened = []));
  await page.fill("#composer-text", "   ");
  await page.click(".composer__send");
  check("תיבת הפוטר ריקה: שגיאה בעברית ולא נפתח וואטסאפ", /[א-ת]/.test(await page.locator("#composer-error").innerText()) && (await page.evaluate(() => window.__opened.length)) === 0);
  await page.fill("#composer-text", "היי זיו, יש לי סטודיו ליוגה ואשמח לשמוע");
  await page.click(".composer__send");
  const composed = await page.evaluate(() => window.__opened);
  check(
    "תיבת הפוטר: נשלח בדיוק מה שהגולש כתב, ל-054-804-4345",
    composed.length === 1 && new URL(composed[0]).pathname === `/${NUMBER}` && new URL(composed[0]).searchParams.get("text") === "היי זיו, יש לי סטודיו ליוגה ואשמח לשמוע",
    composed[0],
  );
  check("תיבת הפוטר עובדת גם בלי JavaScript (action ל-wa.me)", (await page.getAttribute(".composer", "action")) === `https://wa.me/${NUMBER}` && (await page.getAttribute("#composer-text", "name")) === "text");

  // 6. שאלות נפוצות: אחת פתוחה בכל פעם
  await page.click("#faq details:nth-of-type(3) summary");
  check("שאלות נפוצות: רק כרטיס אחד פתוח", (await page.locator("#faq details[open]").count()) === 1);

  // 7. חוויית הגלילה
  for (const width of [390, 1440]) {
    const mp = await browser.newPage({ viewport: { width, height: 844 } });
    await mp.goto(URL_, { waitUntil: "networkidle" });
    const linked = await mp.evaluate(() => document.getAnimations().filter((a) => a.timeline && !(a.timeline instanceof DocumentTimeline)).length);
    check(`${width}px: אנימציות גלילה פעילות (צמודות לגלילה, בלי JS)`, linked >= 20, `${linked}`);
    // גוללים לאט עד הסוף ובודקים בדרך שאין גלילה הצידה
    const overflowDuringScroll = await mp.evaluate(async () => {
      let worst = 0;
      for (let y = 0; y <= document.documentElement.scrollHeight; y += 200) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        worst = Math.max(worst, document.documentElement.scrollWidth - innerWidth);
      }
      return worst;
    });
    check(`${width}px: אין גלילה הצידה באף שלב של הגלילה`, overflowDuringScroll <= 0, `${overflowDuringScroll}px`);
    // בסוף הגלילה כל אלמנט מונפש שכבר עבר במסך גמור: אטום, לא חתוך ולא מוזז
    const unfinished = await mp.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.timeline && !(a.timeline instanceof DocumentTimeline))
        .map((a) => a.effect.target)
        .filter((el) => el.getBoundingClientRect().bottom < innerHeight * 0.6 && !el.closest(".hero") && !el.matches(".how__pic img"))
        .filter((el) => { const cs = getComputedStyle(el); return +cs.opacity < 0.99 || (cs.clipPath !== "none" && !/inset\(0(px)?( round 0(px)?)?\)/.test(cs.clipPath)); })
        .map((el) => el.className || el.tagName),
    );
    check(`${width}px: אחרי הגלילה אין טקסט שנשאר שקוף או חתוך`, unfinished.length === 0, unfinished.join(", "));
    await mp.close();
  }
  // העיגול סביב "ספרו לי…": האזור נעצר בזמן שהעיגול נמתח, ואז הגלילה ממשיכה
  for (const [width, height] of [[390, 844], [375, 667], [1440, 900]]) {
    const cp = await browser.newPage({ viewport: { width, height } });
    await cp.goto(URL_, { waitUntil: "networkidle" });
    const g = await cp.evaluate(() => { const r = document.querySelector(".pain").getBoundingClientRect(); return { top: r.top + scrollY, hold: r.height - innerHeight }; });
    const at = async (y) => {
      await cp.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(y));
      await cp.waitForTimeout(120);
      return cp.evaluate(() => ({
        dash: parseFloat(getComputedStyle(document.querySelector(".pain__circle path")).strokeDashoffset),
        stage: Math.round(document.querySelector(".pain__stage").getBoundingClientRect().top),
        fits: document.querySelector(".pain__stage").getBoundingClientRect().height <= innerHeight + 1,
        notes: [...document.querySelectorAll(".note")].map((n) => +getComputedStyle(n).opacity),
      }));
    };
    const s0 = await at(g.top), sN = await at(g.top + g.hold * 0.25), s1 = await at(g.top + g.hold * 0.75), s2 = await at(g.top + g.hold), s3 = await at(g.top + g.hold + 300);
    check(`${width}x${height}: האזור נעצר במסך בזמן ההחזקה (${Math.round(g.hold)}px)`, g.hold > 200 && s0.stage === 0 && s1.stage === 0 && s2.stage === 0 && s3.stage < 0 && s1.fits, JSON.stringify({ s0, s1, s2, s3 }));
    check(
      `${width}x${height}: ההתראות נערמות אחת-אחת בחצי הראשון של העצירה`,
      s0.notes.every((o) => o < 0.2) && sN.notes[0] > 0.99 && sN.notes[3] < 0.2 && s1.notes.every((o) => o > 0.99),
      JSON.stringify([s0.notes, sN.notes, s1.notes]),
    );
    check(`${width}x${height}: העיגול נמתח עם הגלילה ונשאר מצויר`, s0.dash > 0.9 && s1.dash > 0.1 && s1.dash < 0.9 && s2.dash < 0.02 && s3.dash < 0.02, [s0.dash, s1.dash, s2.dash, s3.dash].map((d) => d.toFixed(2)).join(" → "));
    const href = await cp.getAttribute(".pain__mark a", "href");
    check(`${width}x${height}: "ספרו לי…" עדיין פותח וואטסאפ`, new URL(href).pathname === `/${NUMBER}`, href);
    await cp.close();
  }

  // העט: ה-viewBox בגודל האמיתי בפיקסלים, כך שהקו באותו עובי בכל מסך ולא נמתח
  for (const width of [390, 768, 1440]) {
    const pp = await browser.newPage({ viewport: { width, height: 900 } });
    await pp.goto(URL_, { waitUntil: "networkidle" });
    await pp.waitForTimeout(150);
    const pens = await pp.evaluate(() =>
      [".intro__line", ".pain__circle"].map((q) => {
        const el = document.querySelector(q);
        const [, , w, h] = el.getAttribute("viewBox").split(" ").map(Number);
        return { q, w, h, bw: el.clientWidth, bh: el.clientHeight };
      }),
    );
    check(`${width}px: הקו והעיגול בעובי אחיד (viewBox = גודל אמיתי)`, pens.every((p) => Math.abs(p.w - p.bw) <= 1 && Math.abs(p.h - p.bh) <= 1), JSON.stringify(pens));
    await pp.close();
  }

  const rm = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await rm.goto(URL_, { waitUntil: "networkidle" });
  const rmState = await rm.evaluate(() => ({
    anims: document.getAnimations().length,
    // רק אלמנטים עם טקסט (סוללה ונקודות בורר מוסתרות בכוונה בעיצוב)
    faded: [...document.querySelectorAll("main *, footer *")].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && +getComputedStyle(el).opacity < 0.99).length,
  }));
  check("הפחתת תנועה: אין אנימציות והכול במצב הסופי", rmState.anims === 0 && rmState.faded === 0, JSON.stringify(rmState));
  const rmCircle = await rm.evaluate(() => ({
    dash: parseFloat(getComputedStyle(document.querySelector(".pain__circle path")).strokeDashoffset),
    sticky: getComputedStyle(document.querySelector(".pain__stage")).position,
  }));
  check("הפחתת תנועה: העיגול מצויר במלואו ואין עצירה", rmCircle.dash === 0 && rmCircle.sticky !== "sticky", JSON.stringify(rmCircle));
  await rm.close();

  // 8. עמודי משנה וקישורים פנימיים
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
