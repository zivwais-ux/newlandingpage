import { pain } from "@/content/site";

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
