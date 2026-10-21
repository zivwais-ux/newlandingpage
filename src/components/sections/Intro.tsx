import { intro } from "@/content/site";
import { PenMark } from "../PenMark";

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
          <PenMark kind="underline" className="intro__line" />
        </span>
        {intro.after}
      </p>
    </section>
  );
}
