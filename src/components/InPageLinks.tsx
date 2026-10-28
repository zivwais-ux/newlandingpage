"use client";

import { useEffect } from "react";

// קישורים לחלקים בדף (#faq, #plans) גוללים לחלק בלי לכתוב אותו בכתובת,
// כך שקישור שמעתיקים או טאב שנפתח מחדש תמיד מתחילים בראש הדף. בלי JavaScript הקישורים עובדים כרגיל.
export function InPageLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ block: "start" });
      // keyboard and screen-reader users land in the section too
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
