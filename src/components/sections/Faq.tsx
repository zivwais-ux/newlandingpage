import { faq } from "@/content/site";

export function Faq() {
  return (
    <section id="faq" className="faq wrap" aria-labelledby="faq-title">
      <div className="faq__inner">
        <h2 id="faq-title" data-reveal>
          {faq.title}
        </h2>
        <div className="faq__stack">
          {faq.items.map((item, i) => (
            <details
              key={item.q}
              name="faq"
              open={i === 0}
              className="faq__card"
              style={{ "--i": i } as React.CSSProperties}
            >
              <summary>
                <span className="faq__tab" aria-hidden="true">
                  {item.tab}
                </span>
                {item.q}
                <span className="faq__sign" aria-hidden="true">
                  <span>+</span>
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
