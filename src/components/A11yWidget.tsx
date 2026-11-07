"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// תוסף הנגישות: כפתור קבוע בפינת המסך שפותח חלון עם הגדרות. כל הגדרה מוסיפה מחלקה ל-<html>,
// ה-CSS עושה את השאר (globals.css, "Accessibility widget"). ההעדפות נשמרות רק בדפדפן של הגולש,
// וסקריפט קטן ב-<head> מחיל אותן לפני הציור הראשון (layout.tsx), כך שאין הבהוב בטעינה.

export const A11Y_KEY = "zs-a11y";

type Prefs = { text: 0 | 1 | 2; contrast: boolean; links: boolean; still: boolean; font: boolean; cursor: boolean };
const EMPTY: Prefs = { text: 0, contrast: false, links: false, still: false, font: false, cursor: false };

/** the classes a set of preferences puts on <html>; the head script in layout.tsx mirrors this */
function classesOf(p: Prefs) {
  return {
    "a11y-text-1": p.text === 1,
    "a11y-text-2": p.text === 2,
    "a11y-contrast": p.contrast,
    "a11y-links": p.links,
    "a11y-still": p.still,
    "a11y-font": p.font,
    "a11y-cursor": p.cursor,
  };
}

function read(): Prefs {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(A11Y_KEY) ?? "{}") };
  } catch {
    return EMPTY;
  }
}

const ICONS = {
  person: "M12 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4.5 8.5 12 10l7.5-1.5M12 10v4.5M12 14.5 9 21M12 14.5l3 6.5",
  contrast: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18",
  links: "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1",
  still: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 9v6M14 9v6",
  font: "M5 19 10.5 5h3L19 19M7.5 13.5h9",
  cursor: "M6 3l12 9-5.5 1.2L16 20l-2.6 1.2-2.6-6.6L6 18z",
  reset: "M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5",
};

function Icon({ d, className = "a11y__icon" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function A11yWidget() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(EMPTY);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const update = (next: Prefs) => {
    setPrefs(next);
    const root = document.documentElement;
    for (const [cls, on] of Object.entries(classesOf(next))) root.classList.toggle(cls, on);
    try {
      localStorage.setItem(A11Y_KEY, JSON.stringify(next));
    } catch {
      // private mode or blocked storage: the setting still applies for this visit
    }
  };

  // Esc closes and returns to the button; a click outside closes
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !toggle.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const switches: { key: Exclude<keyof Prefs, "text">; label: string; icon: string }[] = [
    { key: "contrast", label: "ניגודיות גבוהה", icon: ICONS.contrast },
    { key: "links", label: "הדגשת קישורים", icon: ICONS.links },
    { key: "still", label: "עצירת אנימציות", icon: ICONS.still },
    { key: "font", label: "גופן קריא", icon: ICONS.font },
    { key: "cursor", label: "סמן גדול", icon: ICONS.cursor },
  ];
  const sizes = ["רגיל", "גדול", "גדול מאוד"] as const;

  return (
    <div className="a11y" dir="rtl">
      <button
        ref={toggle}
        type="button"
        className="a11y__toggle"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        onClick={() => {
          // the panel starts from what is stored (the head script already applied it to the page)
          if (!open) setPrefs(read());
          setOpen(!open);
        }}
      >
        <Icon d={ICONS.person} className="a11y__toggle-icon" />
        {/* shown by CSS whenever any setting is on (a class on <html>), so it is right from the first paint */}
        <span className="a11y__dot" aria-hidden="true" />
      </button>
      {open && (
        <div ref={panel} id="a11y-panel" className="a11y__panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title">
          <p id="a11y-title" className="a11y__title">
            נגישות
          </p>
          <div className="a11y__group" role="group" aria-label="גודל טקסט">
            <span className="a11y__label">גודל טקסט</span>
            <div className="a11y__sizes">
              {sizes.map((label, i) => (
                <button key={label} type="button" aria-pressed={prefs.text === i} onClick={() => update({ ...prefs, text: i as Prefs["text"] })}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="a11y__grid">
            {switches.map((s) => (
              <button key={s.key} type="button" className="a11y__switch" aria-pressed={prefs[s.key]} onClick={() => update({ ...prefs, [s.key]: !prefs[s.key] })}>
                <Icon d={s.icon} />
                {s.label}
              </button>
            ))}
            <button type="button" className="a11y__switch a11y__reset" onClick={() => update(EMPTY)}>
              <Icon d={ICONS.reset} />
              איפוס
            </button>
          </div>
          <Link href="/accessibility" className="link a11y__statement" onClick={() => setOpen(false)}>
            הצהרת נגישות
          </Link>
        </div>
      )}
    </div>
  );
}
