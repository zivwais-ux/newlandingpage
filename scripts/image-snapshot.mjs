// מצלם את רשימת התמונות בדף (קובץ, alt, והאזור שבו היא מופיעה) כדי לוודא ששום תמונה לא זזה או הוחלפה.
import { chromium } from "playwright";

export async function imageSnapshot(url, browser) {
  const out = {};
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    out[width] = await page.evaluate(() =>
      [...document.querySelectorAll("main img, header img")].map((img) => {
        const src = new URL(img.currentSrc || img.src, location.href);
        const file = src.searchParams.get("url") ?? src.pathname;
        const section = img.closest("section")?.id || img.closest("section")?.className.split(" ")[0] || "";
        return { file, alt: img.alt, section };
      }),
    );
    await page.close();
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-sandbox"] });
  console.log(JSON.stringify(await imageSnapshot(process.argv[2] ?? "http://localhost:4321/", browser), null, 2));
  await browser.close();
}
