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
        floating: document.querySelector("[data-floating-whatsapp], .float-wa") !== null,
        pink: [...document.querySelectorAll("*")].some((el) => /248, 199, 201/.test(getComputedStyle(el).backgroundColor)),
        prices: /₪|ש״ח|\d[\d,.]*\s*(אלף\s*)?שקלים/.test(document.body.innerText), // an amount, not the words "אלפי שקלים" about other courses
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
    check(`${width}px: אין כפתור וואטסאפ צף (הכפתור שבתפריט תמיד גלוי)`, !info.floating);
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
  check("הלוגו 'ZIV solutions' בתפריט ובפוטר", (await page.locator(".nav .logo").innerText()).replace(/\s+/g, " ").trim() === "ZIV solutions" && (await page.locator("footer .logo").count()) === 1);
  const heroBg = await page.evaluate(() => getComputedStyle(document.querySelector(".hero")).backgroundColor);
  check("הירו: רקע ירוק יער וכותרת לבנה", heroBg === "rgb(15, 61, 36)" && (await page.evaluate(() => getComputedStyle(document.querySelector(".hero h1")).color)) === "rgb(255, 255, 255)", heroBg);
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
  await page.waitForTimeout(150);
  const navTop = await page.evaluate(() => Math.round(document.querySelector(".nav").getBoundingClientRect().top));
  check("התפריט נשאר צף למעלה גם אחרי גלילה", navTop >= 0 && navTop <= 24, String(navTop));
  for (const width of [390, 1440]) {
    const wp = await browser.newPage({ viewport: { width, height: 844 } });
    await wp.goto(URL_, { waitUntil: "networkidle" });
    await wp.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: "instant" }));
    await wp.waitForTimeout(150);
    const btn = await wp.evaluate(() => {
      const a = document.querySelector('.nav a[href*="wa.me"]');
      const r = a.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(a).visibility === "visible";
    });
    check(`${width}px: כפתור הוואטסאפ שבתפריט גלוי באמצע הדף`, btn);
    await wp.close();
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const strip = await page.locator(".strip__list:not([aria-hidden]) li").allInnerTexts();
  check("הפוטר: הפס הנע מציג את כל הכלים מהדוגמאות", strip.length === 6 && strip.includes("דפי עבודה בשלוש רמות"), strip.join(" | "));
  check("הפוטר: בלי השורה הכפולה 'או התקשרו'", !(await page.locator("footer").innerText()).includes("או התקשרו"));
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
        // (the evening sky behind "עוד ערב של עבודה?" is decoration: half-dark and the earlier hours hidden on purpose)
        .filter((el) => el.getBoundingClientRect().bottom < innerHeight * 0.6 && !el.closest(".hero, .pain__sky") && !el.matches(".how__pic img"))
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
        // העיגול (כולל הזנב) לא נוגע באף כרטיס התראה
        hit: (() => {
          const c = document.querySelector(".pain__circle").getBoundingClientRect();
          return [...document.querySelectorAll(".note")].some((n) => {
            const r = n.getBoundingClientRect();
            return c.left < r.right && c.right > r.left && c.top < r.bottom && c.bottom > r.top;
          });
        })(),
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
    check(`${width}x${height}: העיגול לא עולה על אף כרטיס התראה`, !s2.hit && !s3.hit);
    const href = await cp.getAttribute(".pain__mark a", "href");
    check(`${width}x${height}: "ספרו לי…" עדיין פותח וואטסאפ`, new URL(href).pathname === `/${NUMBER}`, href);
    await cp.close();
  }

  // "איך זה עובד": שלושה כרטיסים שנצמדים ונערמים; הקודם מתכווץ כשהבא מחליק מעליו
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const hp = await browser.newPage({ viewport: { width, height } });
    await hp.goto(URL_, { waitUntil: "networkidle" });
    const info = await hp.evaluate(() => ({
      cards: document.querySelectorAll(".how__card").length,
      sticky: [...document.querySelectorAll(".how__card")].every((c) => getComputedStyle(c).position === "sticky"),
      imgs: [...document.querySelectorAll(".how__card img")].map((i) => i.getAttribute("src").split("?")[0]),
      chat: document.querySelectorAll(".how__card--1 .phone--wa").length,
      cta: document.querySelectorAll("#how .how__cta a[href*='wa.me']").length,
      card2Top: document.querySelector(".how__card--2").getBoundingClientRect().top + scrollY,
      head: (() => { const h = document.querySelector("#how-title"); const cs = getComputedStyle(h); return { text: h.textContent.trim(), align: cs.textAlign, weight: cs.fontWeight }; })(),
    }));
    check(`${width}px: איך זה עובד: הכותרת ממורכזת, מודגשת ומסתיימת בסימן שאלה`, info.head.align === "center" && +info.head.weight >= 600 && info.head.text.endsWith("?"), JSON.stringify(info.head));
    check(`${width}px: איך זה עובד: בכרטיס השני התמונה מבית הקפה, ובשלישי העבודה לבד`, info.imgs[0] === "/img/build-together.webp" && info.imgs[1] === "/img/on-your-own.webp", JSON.stringify(info.imgs));
    check(`${width}px: איך זה עובד: 3 כרטיסים נצמדים, עם השיחה, שתי התמונות והכפתור`, info.cards === 3 && info.sticky && info.chat === 1 && info.imgs.length === 2 && info.cta === 1, JSON.stringify(info));
    const scaleAt = async (y) => {
      await hp.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(y));
      await hp.waitForTimeout(150);
      return hp.evaluate(() => { const m = getComputedStyle(document.querySelector(".how__card--1")).transform; return m === "none" ? 1 : +m.slice(7).split(",")[0]; });
    };
    const before = await scaleAt(info.card2Top - height * 1.2);
    // the moment card 2 locks under the menu (92px + 14px on a phone, 104px + 16px on desktop)
    const covered = await scaleAt(info.card2Top - (width >= 900 ? 120 : 106) + 4);
    check(`${width}px: כשהכרטיס השני מחליק מעל הראשון, הראשון מתכווץ`, before > 0.99 && covered < 0.97, `${before} → ${covered}`);
    await hp.close();
  }

  // "עוד ערב של עבודה?": MacBook שעולה והמכסה שלו נפתח לפני העצירה; ההתראות על המסך
  for (const [width, height] of [[390, 844], [375, 667], [1440, 900]]) {
    const mp = await browser.newPage({ viewport: { width, height } });
    await mp.goto(URL_, { waitUntil: "networkidle" });
    const g = await mp.evaluate(() => { const r = document.querySelector(".pain").getBoundingClientRect(); return { top: r.top + scrollY, hold: r.height - innerHeight }; });
    const lidAt = async (y) => {
      await mp.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(y));
      await mp.waitForTimeout(120);
      return mp.evaluate(() => getComputedStyle(document.querySelector(".laptop__lid")).transform);
    };
    const before = await lidAt(g.top - height * 0.3);
    const held = await lidAt(g.top + g.hold * 0.2);
    const laptopShown = await mp.evaluate(() => getComputedStyle(document.querySelector(".laptop__body")).display !== "none");
    check(`${width}x${height}: MacBook עם 4 ההתראות`, (await mp.locator(".laptop .note").count()) === 4 && laptopShown);
    // הרקע: הערב מחשיך, השעון מתקדם עם ההתראות, נקודות האור זזות; בטלפון ההתראות בזיגזג
    const sky = async (y) => {
      await mp.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(y));
      await mp.waitForTimeout(120);
      return mp.evaluate(() => {
        const texts = [...document.querySelectorAll(".pain__hour")];
        const shown = texts.filter((t) => +getComputedStyle(t).opacity > 0.6).map((t) => t.textContent);
        const night = +getComputedStyle(document.querySelector(".pain__night")).opacity;
        const rots = [...document.querySelectorAll(".laptop .note")].map((n) => getComputedStyle(n).transform);
        return { shown, night, rots, stars: document.getAnimations().filter((a) => a.animationName === "star-drift").length };
      });
    };
    const k0 = await sky(g.top), k1 = await sky(g.top + g.hold * 0.25), k2 = await sky(g.top + g.hold * 0.75);
    check(`${width}x${height}: הערב מחשיך בזמן שההתראות מגיעות`, k0.night < 0.05 && k2.night > 0.28, `${k0.night} → ${k2.night}`);
    check(`${width}x${height}: השעון ברקע מתקדם עם ההתראות`, k0.shown.join() === "21:40" && k2.shown.join() === "23:02" && k1.shown.length === 1, `${k0.shown} → ${k1.shown} → ${k2.shown}`);
    {
      // הגוון הכהה ביותר: מרווה עם שכבת יער באטימות של סוף העצירה, מול הטקסט השחור
      const mix = [168, 195, 174].map((c, i) => c * (1 - k2.night) + [15, 61, 36][i] * k2.night);
      const lum = (rgb) => { const [r, g2, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g2 + 0.0722 * b; };
      const ratio = (lum(mix) + 0.05) / (lum([10, 10, 10]) + 0.05);
      check(`${width}x${height}: גם כשהערב הכי כהה, הטקסט קריא (ניגודיות ${ratio.toFixed(1)}:1)`, ratio >= 4.5);
    }
    check(`${width}x${height}: נקודות האור ברקע זזות`, k2.stars >= 2, String(k2.stars));
    if (width < 900) {
      check(`${width}x${height}: בטלפון ההתראות ישרות (באנרים של מק)`, k2.rots.every((t) => t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)"), k2.rots.join(" | "));
      // the notifications stack above the machine, the last one overlapping just the top of the lid
      const pos = await mp.evaluate(() => {
        const notes = [...document.querySelectorAll(".laptop .note")].map((n) => n.getBoundingClientRect());
        const lid = document.querySelector(".laptop__lid").getBoundingClientRect();
        return { lastBottom: Math.round(notes[3].bottom), lidTop: Math.round(lid.top), lidBottom: Math.round(lid.bottom), firstTop: Math.round(notes[0].top) };
      });
      const size = await mp.evaluate(() => {
        const body = document.querySelector(".laptop__body").getBoundingClientRect();
        const stack = document.querySelector(".laptop > .pain__stack").getBoundingClientRect();
        return { body: Math.round(body.width), stack: Math.round(stack.width), vw: innerWidth, centred: Math.abs(body.left + body.right - innerWidth) <= 2 };
      });
      check(`${width}x${height}: המחשב גדול וממורכז, וההתראות צרות ממנו`, size.centred && size.stack < size.body && (height <= 760 || size.body >= size.vw * 0.8), JSON.stringify(size));
      check(`${width}x${height}: ההתראות מעל המחשב ויוצאות מראש המסך`, pos.firstTop < pos.lidTop && pos.lastBottom > pos.lidTop && pos.lastBottom < (pos.lidTop + pos.lidBottom) / 2, JSON.stringify(pos));
    }
    if (width >= 900) check(`${width}x${height}: המכסה נפתח בגלילה ופתוח לגמרי בזמן העצירה`, before !== "none" && (held === "none" || held === "matrix(1, 0, 0, 1, 0, 0)"), `${before.slice(0, 30)} → ${held}`);
    else {
      // phone: partly open, and more open in the hold than before it (the angle is read from the matrix)
      const angle = (m) => { const v = m.match(/matrix3d\(([^)]+)\)/); if (!v) return m === "none" ? 0 : NaN; const n = v[1].split(",").map(Number); return Math.round((Math.atan2(n[6], n[5]) * 180) / Math.PI); };
      const later = await lidAt(g.top + g.hold * 0.6);
      check(`${width}x${height}: בטלפון המכסה פתוח חלקית ונפתח עוד בגלילה`, angle(before) < angle(later) && angle(later) < -20 && angle(later) > -60, `${angle(before)}° → ${angle(later)}°`);
    }
    if (width >= 900) {
      await mp.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(g.top + g.hold * 0.9));
      await mp.waitForTimeout(120);
      const inside = await mp.evaluate(() => {
        const sc = document.querySelector(".laptop__screen").getBoundingClientRect();
        // the banners sit on the screen and may spill a little past its frame: their centres are on it
        return [...document.querySelectorAll(".laptop .note")].every((n) => { const r = n.getBoundingClientRect(); const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2; return cx > sc.left && cx < sc.right && cy > sc.top && cy < sc.bottom; });
      });
      check(`${width}px: ההתראות יושבות על מסך המחשב`, inside);
    }
    await mp.close();
  }

  // "מה בונים": אייפון שעולה ומתיישר בגלילה; בבחירת עסק מתחלף רק המסך
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const ip = await browser.newPage({ viewport: { width, height } });
    await ip.goto(URL_, { waitUntil: "networkidle" });
    const y = await ip.evaluate(() => document.querySelector(".build__object").getBoundingClientRect().top + scrollY);
    const at = async (top) => {
      await ip.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), Math.round(top));
      await ip.waitForTimeout(120);
      return ip.evaluate(() => getComputedStyle(document.querySelector(".iphone")).transform);
    };
    const mid = await at(y - height * 0.9);
    const end = await at(y - 40);
    check(`${width}px: אייפון עם Dynamic Island במקום הכרטיס`, (await ip.locator(".build__object .iphone .iphone__island").count()) === 1 && (await ip.locator(".build__object .iphone .phone--bare").count()) === 1);
    check(`${width}px: האייפון עולה מוטה ומתיישר עד סוף הכניסה`, mid !== "none" && (end === "none" || end === "matrix(1, 0, 0, 1, 0, 0)"), `${mid} → ${end}`);
    await ip.evaluate(() => (document.querySelector(".iphone").dataset.same = "1"));
    await ip.locator(".build__name").nth(3).click();
    await ip.waitForTimeout(350);
    check(`${width}px: בחירת עסק מחליפה רק את המסך, המכשיר נשאר`, (await ip.locator('.iphone[data-same="1"]').count()) === 1 && (await ip.locator(".iphone .ai__tool").innerText()).length > 2);
    await ip.close();
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
    faded: [...document.querySelectorAll("main *, footer *")].filter((el) => !el.closest(".pain__sky") && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && +getComputedStyle(el).opacity < 0.99).length,
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
