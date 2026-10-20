import { pain } from "@/content/site";
import { WhatsAppButton } from "../WhatsAppButton";

// עיגול בכתב-יד סביב "ספרו לי…": נמתח בקצב הגלילה בזמן שהאזור נעצר במסך (CSS בלבד).
// בלי תמיכה בדפדפן או עם הפחתת תנועה הוא מוצג מצויר במלואו.
function HandCircle() {
  return (
    <svg className="pain__circle" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
      <path
        pathLength={1}
        d="M176 8C140 0 62 0 26 8C2 14 2 46 26 53C66 62 148 61 178 50C200 42 199 14 166 5C146 0 122 1 102 4"
      />
    </svg>
  );
}

export function Pain() {
  return (
    <section className="pain" aria-labelledby="pain-title">
      <div className="pain__stage">
        <div className="wrap pain__grid">
          <div>
            <h2 id="pain-title" data-reveal>
              {pain.title}
            </h2>
            <p className="pain__answer">{pain.answer}</p>
            <p className="pain__cta">
              <span className="pain__mark">
                <WhatsAppButton label={pain.cta} location="pain" variant="text" />
                <HandCircle />
              </span>
            </p>
          </div>
          <ul className="pain__list">
            {pain.items.map((item) => (
              <li key={item}>
                <span className="dot" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
