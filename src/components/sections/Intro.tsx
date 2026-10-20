import { intro } from "@/content/site";
import { IntroIcon } from "../IntroIcon";

export function Intro() {
  return (
    <section className="intro wrap" aria-label="מה זה שיעור">
      <p data-reveal>
        {intro.map((part) => (
          <span key={part.text}>
            {part.text}
            {part.icon && <IntroIcon name={part.icon} />}
          </span>
        ))}
      </p>
    </section>
  );
}
