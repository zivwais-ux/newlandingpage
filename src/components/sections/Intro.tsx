import { intro } from "@/content/site";

// משפט הפתיחה: כל מילה "מתמלאת בדיו" בזמן הגלילה, ואז קו בכתב-יד נמתח מתחת ל"כלי שעובד"
// (אותו עט כמו העיגול באזור ההתראות). CSS בלבד; בלי תמיכה או עם הפחתת תנועה הכול מוצג גמור.
function Words({ text }: { text: string }) {
  return text
    .trim()
    .split(/\s+/)
    .map((word, i) => (
      <span key={i}>
        {i > 0 && " "}
        <span className="ink">{word}</span>
      </span>
    ));
}

export function Intro() {
  return (
    <section className="intro wrap" aria-label="מה זה שיעור">
      <p data-reveal data-fill>
        <Words text={intro.before} />{" "}
        <span className="intro__mark">
          <Words text={intro.mark} />
          <svg className="intro__line" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M197 4C168 5 138 3 104 6C70 9 38 4 3 8" />
          </svg>
        </span>
        {intro.after}
      </p>
    </section>
  );
}
