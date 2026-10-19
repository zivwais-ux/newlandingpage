import { pain } from "@/content/site";
import { WhatsAppButton } from "../WhatsAppButton";

export function Pain() {
  return (
    <section className="pain" aria-labelledby="pain-title">
      <div className="wrap pain__grid">
        <div>
          <h2 id="pain-title" data-reveal>
            {pain.title}
          </h2>
          <p className="pain__answer" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            {pain.answer}
          </p>
          <p className="pain__cta" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <WhatsAppButton label={pain.cta} location="pain" variant="text" />
          </p>
        </div>
        <ul className="pain__list">
          {pain.items.map((item, i) => (
            <li key={item} data-reveal style={{ "--d": i + 1 } as React.CSSProperties}>
              <span className="dot" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
