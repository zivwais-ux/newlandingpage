import { intro } from "@/content/site";
import { IntroIcon } from "../IntroIcon";

// כל מילה ב-span משלה, כדי שהמשפט "יתמלא בדיו" מילה אחרי מילה בזמן הגלילה (CSS בלבד).
// עותק שחור של המילה (ink__on, מוסתר מקוראי מסך) נחשף מעל האפור עם opacity, שרץ על ה-GPU.
// האייקון נצמד למילה שלפניו, כך שהם מתמלאים יחד ולא נשברים לשורות נפרדות.
export function Intro() {
  return (
    <section className="intro wrap" aria-label="מה זה שיעור">
      <p data-reveal data-fill>
        {intro.map((part, p) => {
          const words = part.text.trim().split(/\s+/);
          const leadingSpace = p > 0 && !part.text.startsWith(",") ? " " : "";
          return (
            <span key={part.text}>
              {leadingSpace}
              {words.map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  <span className="ink">
                    <span className="ink__word">
                      {word}
                      <span className="ink__on" aria-hidden="true">
                        {word}
                      </span>
                    </span>
                    {i === words.length - 1 && part.icon && <IntroIcon name={part.icon} />}
                  </span>
                </span>
              ))}
            </span>
          );
        })}
      </p>
    </section>
  );
}
