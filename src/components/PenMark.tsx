"use client";

import { useEffect, useRef, useState } from "react";

// סימון בעט: עיגול או קו תחתון שנמתחים בקצב הגלילה (ה-CSS מצייר עם stroke-dashoffset).
// ה-viewBox נקבע לגודל האמיתי בפיקסלים, כך שהקו נשאר באותו עובי בכל מסך ולא נמתח.

type Kind = "circle" | "underline" | "box" | "arrow";

const PAD = 4;
const r = (n: number) => Math.round(n * 10) / 10;

/** עקומה חלקה דרך הנקודות (Catmull-Rom כ-Bezier) */
function smooth(pts: [number, number][]): string {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

/** לולאה אחת סביב המילים: מתחילה למעלה מימין, נעה נגד כיוון השעון כמו יד שכותבת עברית,
 *  ונסגרת קצת מעבר להתחלה, כמו עט אמיתי. */
export function circlePath(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - PAD;
  const ry = h / 2 - PAD;
  const start = -62;
  const end = start - 360 - 28;
  // אליפסה "מרובעת" מעט (superellipse) כדי שהלולאה תעטוף שורת טקסט ולא תחתוך את הפינות שלה
  const e = 2 / 2.7;
  const pts: [number, number][] = [];
  for (let a = start; a >= end - 0.01; a -= 12) {
    const t = (start - a) / (start - end);
    // הרוחב מלא לכל אורך הלולאה; רק בגובה היא מתחילה מעט פנימה ומסיימת בקצה,
    // כך שהזנב חוצה את ההתחלה מבחוץ, כמו עט שלא עוצר בדיוק, ונשאר בתוך הקופסה
    const kx = 0.97 + 0.03 * t;
    const ky = 0.88 + 0.12 * t;
    const rad = (a * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    pts.push([cx + rx * kx * Math.sign(c) * Math.abs(c) ** e, cy + ry * ky * Math.sign(s) * Math.abs(s) ** e]);
  }
  return smooth(pts);
}

/** קשת עדינה אחת מימין לשמאל, שעולה מעט בסוף */
export function underlinePath(w: number, h: number): string {
  const y = h / 2;
  return `M${r(w - PAD)} ${r(y)}C${r(w * 0.66)} ${r(y + h * 0.28)} ${r(w * 0.3)} ${r(y + h * 0.22)} ${r(PAD)} ${r(y - h * 0.18)}`;
}

/** תיבה שצוירה ביד סביב שם: מלבן עם פינות רכות, קווים שלא ממש ישרים, וסגירה שעוברת קצת את ההתחלה.
 *  הרעידות קבועות לכל גודל (לא אקראיות), כך שהשרת והדפדפן מציירים אותה תיבה. */
export function boxPath(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - PAD;
  const ry = h / 2 - PAD;
  const start = -40;
  const end = start - 360 - 16;
  const e = 2 / 9; // superellipse close to a rectangle, with soft corners
  const seed = (w * 7 + h * 13) % 17;
  const pts: [number, number][] = [];
  for (let a = start; a >= end - 0.01; a -= 6) {
    const t = (start - a) / (start - end);
    const rad = (a * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    // a hand that drifts a little: the sides bow by a pixel or two, and the closing stroke runs wide
    const wob = Math.sin(a / 23 + seed) * 1.3 + Math.sin(a / 9 + seed * 2) * 0.5;
    const grow = 1 + 0.025 * t;
    pts.push([cx + (rx * grow + wob) * Math.sign(c) * Math.abs(c) ** e, cy + (ry * grow + wob) * Math.sign(s) * Math.abs(s) ** e]);
  }
  return smooth(pts);
}

/** חץ שצויר ביד: קשת קלה אל הצומת הבא וראש של שני קווים קצרים.
 *  רחב משגבוה: מימין לשמאל (כיוון הקריאה); גבוה משרחב: מלמעלה למטה. */
export function arrowPath(w: number, h: number): string {
  if (w >= h) {
    const y = h / 2;
    const x0 = w - PAD;
    const x1 = PAD + 2;
    const shaft = `M${r(x0)} ${r(y + 2)}C${r(w * 0.68)} ${r(y - h * 0.32)} ${r(w * 0.34)} ${r(y - h * 0.3)} ${r(x1)} ${r(y)}`;
    return `${shaft}M${r(x1 + 11)} ${r(y - 8)}L${r(x1)} ${r(y)}L${r(x1 + 12)} ${r(y + 6)}`;
  }
  const x = w / 2;
  const y0 = PAD;
  const y1 = h - PAD - 2;
  const shaft = `M${r(x - 2)} ${r(y0)}C${r(x + w * 0.3)} ${r(h * 0.36)} ${r(x - w * 0.3)} ${r(h * 0.62)} ${r(x)} ${r(y1)}`;
  return `${shaft}M${r(x - 8)} ${r(y1 - 11)}L${r(x)} ${r(y1)}L${r(x + 6)} ${r(y1 - 12)}`;
}

const DEFAULT = { circle: [200, 60], underline: [200, 12], box: [240, 70], arrow: [80, 30] } as const;

export function PenMark({ kind, className }: { kind: Kind; className: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<readonly [number, number]>(DEFAULT[kind]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize([Math.round(width), Math.round(height)]);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [w, h] = size;
  const d = { circle: circlePath, underline: underlinePath, box: boxPath, arrow: arrowPath }[kind](w, h);
  return (
    <svg ref={ref} className={className} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path pathLength={1} d={d} />
    </svg>
  );
}
