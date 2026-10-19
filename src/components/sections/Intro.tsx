import Image from "next/image";
import { intro } from "@/content/site";

export function Intro() {
  return (
    <section className="intro wrap" aria-label="מה זה שיעור">
      <p data-reveal>
        {intro.map((part) => (
          <span key={part.text}>
            {part.text}
            {part.img && (
              <span className="intro__pic">
                <Image src={part.img} alt={part.alt ?? ""} width={640} height={480} loading="lazy" />
              </span>
            )}
          </span>
        ))}
      </p>
    </section>
  );
}
